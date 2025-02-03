import React, { createContext, useContext, useEffect, useState } from 'react';
import { IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng'; // Agora SDK에서 필요한 타입을 가져옵니다.

interface IRemoteUser {
    uid: number;
    videoTrack?: IRemoteVideoTrack; // IRemoteVideoTrack 타입 사용
    audioTrack?: IRemoteAudioTrack; // IRemoteAudioTrack 타입 사용
}

interface AgoraContextType {
    localTracks: Record<string, (any)[]>; // channelName을 키로 사용
    remoteUsers: Record<string, Record<number, IRemoteUser>>; // channelName을 키로 사용
    clients: Record<string, any | null>; // channelName을 키로 사용
}

const AgoraContext = createContext<AgoraContextType | undefined>(undefined);

export const AgoraProvider: React.FC<{ children: React.ReactNode; appId: string; channelNames: string[]; }> = ({ children, appId, channelNames }) => {
    const [clients, setClients] = useState<Record<string, any | null>>({});
    const [localTracks, setLocalTracks] = useState<Record<string, (any)[]>>({});
    const [remoteUsers, setRemoteUsers] = useState<Record<string, Record<number, IRemoteUser>>>({});

    useEffect(() => {
        const initClient = async (channel: string) => {
            const AgoraRTC = (await import('agora-rtc-sdk-ng')).default; // 클라이언트 측에서만 로드
            const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
            setClients((prev) => ({ ...prev, [channel]: agoraClient }));
            await agoraClient.join(appId, channel, null);
            const [microphoneTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
            setLocalTracks((prev) => ({ ...prev, [channel]: [microphoneTrack] }));
            await agoraClient.unpublish([microphoneTrack]);
        };

        // 모든 채널에 대해 클라이언트를 초기화
        if (typeof window !== 'undefined' && channelNames.length > 0) {
            channelNames.forEach(channel => {
                initClient(channel);
            });
        }

        return () => {
            // 각 채널에 대해 정리 작업 수행
            channelNames.forEach(channel => {
                localTracks[channel]?.forEach((track) => track.close());
                if (clients[channel]) {
                    clients[channel]?.leave();
                }
            });
        };
    }, [channelNames, appId]); // appId도 의존성 배열에 추가

    useEffect(() => {
        if (channelNames.length > 0) {
            channelNames.forEach(channel => {
                const client = clients[channel];
                if (client) {
                    client.on('user-published', async (user: any, mediaType: any) => {
                        try {
                            // 피어 연결이 정상적인지 확인
                            if (client.connectionState === 'CONNECTED') {
                                // 오디오 및 비디오 모두 구독
                                await client.subscribe(user, mediaType);
                                const uid = Number(user.uid);

                                // remoteUsers 상태 업데이트
                                setRemoteUsers((prev) => {
                                    const updatedUsers = prev[channel] || {};
                                    const updatedUser = updatedUsers[uid] || {};

                                    // 미디어 타입에 따라 트랙 설정
                                    if (mediaType === 'video') {
                                        updatedUser.videoTrack = user.videoTrack;
                                    }
                                    if (mediaType === 'audio') {
                                        updatedUser.audioTrack = user.audioTrack;
                                    }

                                    return {
                                        ...prev,
                                        [channel]: {
                                            ...updatedUsers,
                                            [uid]: updatedUser
                                        }
                                    };
                                });

                                // 오디오 트랙이 있는 경우, 로컬에서 재생
                                if (mediaType === 'audio' && user.audioTrack) {
                                    user.audioTrack.play(); // 오디오 트랙 재생
                                }
                            }
                        } catch (error) {
                            console.error('Error subscribing to user:', error);
                        }
                    });

                    client.on('user-unpublished', (user: any) => {
                        setRemoteUsers((prev) => {
                            const updatedUsers = { ...prev[channel] };
                            delete updatedUsers[Number(user.uid)];
                            return {
                                ...prev,
                                [channel]: updatedUsers
                            };
                        });
                    });
                }
            });
        }
    }, [clients, channelNames]);
    // console.log(clients)
    return (
        <AgoraContext.Provider value={{ localTracks, remoteUsers, clients }}>
            {children}
        </AgoraContext.Provider>
    );
};

export const useAgora = () => {
    const context = useContext(AgoraContext);
    if (!context) {
        throw new Error('useAgora must be used within an AgoraProvider');
    }
    return context;
};
