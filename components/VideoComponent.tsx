import React, { useEffect, useState } from 'react';
import { useAgora } from './AgoraContext';
import Image from 'next/image';
import micon from "@/icons/micon.svg";
import micoff from "@/icons/micoff.svg";
import dummy from "@/icons/dummy.svg";
import { useQuery } from 'react-query';
import getKeyBox, { getGuestMany, getMessageIntro } from '@/service/getKeyBox';
import RoominfoSet2 from './KeyBox';
import { IRemoteAudioTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import calloff from "@/icons/calloff.svg"
import { putGuest } from '@/service/putKeyBox';

interface IRemoteUser {
    uid: number;
    videoTrack?: IRemoteVideoTrack; // 비디오 트랙
    audioTrack?: IRemoteAudioTrack; // 오디오 트랙
}

interface VideoComponentProps {
    channelName: string; // channelName prop 추가
    setActiveChannelNames: any;
    imageData: [];
    channelNames: string[];
}

const VideoComponent: React.FC<VideoComponentProps> = ({ channelName, setActiveChannelNames, imageData, channelNames }) => {
    const { remoteUsers, localTracks, clients } = useAgora();
    const [isMouseDown, setIsMouseDown] = useState<{ [key: number]: boolean }>({});
    const [isMicPublished, setIsMicPublished] = useState<{ [key: number]: boolean }>({});
    const [isCallActive, setIsCallActive] = useState(true);

    const [acceptCheckIds, setAcceptCheckIds] = useState<{ [key: string]: number }>({
        [channelName]: 0, // 초기값 설정
    });


    const { data: keyData, refetch: keyBoxRefetch } = useQuery({
        queryKey: ['keydata', Number(channelName.split('_')[0])],
        queryFn: () => getKeyBox(Number(channelName.split('_')[0])),
        enabled: !!Number(channelName.split('_')[0]),
    })

    const { data: mgData } = useQuery({
        queryKey: ['Mgdata', Number(channelName.split('_')[0])],
        queryFn: () => getMessageIntro(Number(channelName.split('_')[0])),
        enabled: !!Number(channelName.split('_')[0]),
    })

    const { data: gtData, isLoading, refetch: gtRefetch } = useQuery({
        queryKey: ['Guestdata', Number(channelName.split('_')[0])], // _ 이전 부분만 사용
        queryFn: () => getGuestMany(Number(channelName.split('_')[0])), // _ 이전 부분만 사용
        enabled: !!Number(channelName.split('_')[0]),
    });

    // const [streamNames] = useState<string[]>(['2', '2_1', '3', '3_1']);
    //     const { data: simData } = useQuery({
    //         queryKey: ['simData'],
    //         queryFn: () => getSimilarity(2)
    //     })
    //     simData.hotel_id.base64이미지 1-1
    //     simData.hotel_id.base64이미지 1-2
    //     simData.hotel_id.base64이미지 1-3
    useEffect(() => {
        if (gtData && gtData.guests) {
            const newIds = gtData.guests
                .filter((guest: any) => guest.process === 1) // process가 1인 경우 필터링
                .map((guest: any) => guest.id); // id 값을 가져옴

            // acceptCheckIds 상태 업데이트
            setAcceptCheckIds(prev => ({
                ...prev,
                [channelName]: newIds, // channelName에 해당하는 id 배열로 설정
            }));
        }
    }, [gtData, channelName]);
    console.log(keyData, mgData, gtData);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const users = remoteUsers[channelName] || {};
            console.log(users)
            Object.keys(users).forEach(async (uid) => {
                const user: IRemoteUser = users[Number(uid)];
                // console.log(user);
                if (user.videoTrack) {

                    const videoElementId = `user-video-${uid}`;
                    const videoElement = document.getElementById(videoElementId);
                    if (videoElement) {
                        user.videoTrack.play(videoElementId);
                    } else {
                        console.error(`Video element ${videoElementId} not found`);
                    }
                }

                if (user.audioTrack) {
                    setIsCallActive(true);
                    if (Number(uid) < 30000) {
                        user.audioTrack.play();
                    } else {
                        user.audioTrack.stop();
                    }
                }
            });
        }
    }, [remoteUsers, channelName]); // channelName 추가

    const handleMicToggle = async (uid: number, action: 'publish' | 'unpublish') => {
        const client = clients[channelName];
        const localTrack = localTracks[channelName]?.[0]; // 첫 번째 트랙을 마이크로 가정
        if (client && localTrack) {
            try {
                if (action === 'publish') {
                    await client.publish([localTrack]);
                    setIsMicPublished((prev) => ({ ...prev, [uid]: true }));
                } else {
                    // 사용자가 이미 채널에 참여 중인지 확인
                    if (client.connectionState === 'CONNECTED') {
                        await client.unpublish([localTrack]);
                        setIsMicPublished((prev) => ({ ...prev, [uid]: false }));
                    }
                }
            } catch (error) {
                console.error('Error toggling microphone:', error);
            }
        }
    };

    const handleCallEnd = async () => {
        const client = clients[channelName];
        if (client) {
            await client.leave(); // Agora 채널 나가기
            setIsCallActive(false); // 통화 상태를 비활성화하여 UI 숨기기

            // activeChannelNames에서 현재 channelName 제거
            setActiveChannelNames((prev: any) => prev.filter((name: string) => name !== channelName));
        }
    };

    const handleChecking = async (acceptData: number) => {
        try {
            console.log(acceptData)
            await putGuest(acceptData, 2);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    const handleRefuse = async (acceptData: number) => {
        try {
            await putGuest(acceptData, 0);
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    console.log(clients)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {Array.isArray(channelNames) && channelNames.includes(channelName) && (
                <button className='px-[2rem] py-[1rem] text-[2rem] border border-black' onClick={handleCallEnd}>
                    {channelName}번 호텔 아고라 통화종료
                </button>
            )}
            {isCallActive && (
                <>
                    {Object.keys(remoteUsers[channelName] || {}).map((uid) => {
                        // console.log(keyData, mgData, gtData, user)
                        const guest = gtData?.guests.find((guest: any) => guest.process === 1 && guest.hotel_id === Number(channelName.split('_')[0]));

                        // guest가 존재할 경우 id_list[1]과 id를 가져옵니다.
                        const imgData = guest?.id_list[1];
                        const acceptData = guest?.id;
                        console.log(acceptData, gtData)
                        // const videoFeedUrls = {
                        //     2: [
                        //         "http://localhost:5000/video_feed/hotel4",
                        //         "http://localhost:5000/video_feed/hotel4",
                        //     ],
                        //     3: [
                        //         "http://localhost:5000/video_feed/hotel3",
                        //         "http://localhost:5000/video_feed/hotel3",
                        //     ],
                        // }[uid] || [];
                        return (
                            <div key={uid} id={`remote-video-${uid}`} style={{ width: '100%', height: '100%', marginBottom: '10px' }}>

                                <div className='flex flex-col ml-[1rem]'>
                                    <video
                                        id={`user-video-${uid}`}
                                        className='w-[83rem] h-[42rem]'
                                        style={{
                                            backgroundColor: 'black',
                                        }}
                                        controls
                                    />
                                    <div className='flex space-x-4'>
                                        {/* {videoFeedUrls.map((url, index) => (
                                            <img key={index} src={url} width="200" height="121" alt={`Stream ${index + 1}`} />
                                        ))} */}
                                    </div>
                                    <div className='flex mt-[1rem]'>
                                        <div>
                                            <div className='flex flex-col'>
                                                <div className='flex'>
                                                    <div className='flex flex-col'>
                                                        {isLoading ? (
                                                            <Image src={dummy} alt='' width={280} height={100} />
                                                        ) : (
                                                            <Image src={imgData} alt='' width={280} height={100} />
                                                        )}
                                                        <button onClick={() => gtRefetch()}>갱신</button>
                                                        {channelName.split('_')[0] === channelName.split('_')[1] && (
                                                            <div className='flex text-[1.2rem]'>
                                                                <button className='w-full border border-black py-[1rem]' onClick={() => { handleRefuse(acceptData); alert('승인거부되었습니다.') }}>거부</button>
                                                                <button className='w-full border border-black py-[1rem] ml-[1rem]' onClick={() => { handleChecking(acceptData); alert("승인처리되었습니다.") }}>승인</button>
                                                            </div>
                                                        )}

                                                    </div>
                                                    <div className='flex flex-col ml-[1rem]'>
                                                        <div className='w-[28rem] h-[10rem] flex flex-col scrollbar1 border border-[#EDEDED]'>
                                                            {mgData?.moonlight_notices
                                                                .slice() // 원본 배열을 변경하지 않기 위해 복사
                                                                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // 내림차순 정렬
                                                                .map((mgDatas: any) => {
                                                                    const createdAtDate = new Date(mgDatas.createdAt);
                                                                    const currentYear = new Date().getFullYear();
                                                                    const createdYear = createdAtDate.getFullYear();

                                                                    // 날짜 형식 설정
                                                                    const formattedDate = createdYear === currentYear
                                                                        ? `${createdAtDate.getMonth() + 1}월 ${createdAtDate.getDate()}일` // 이번 년도
                                                                        : `${createdYear}년 ${createdAtDate.getMonth() + 1}월 ${createdAtDate.getDate()}일`; // 다른 년도
                                                                    return (
                                                                        <div className={`w-full flex px-[1rem] py-[1rem] bg-white border-b border-[#CCCCCC]`} key={mgData.createdAt} >
                                                                            <div className="w-[75%]">
                                                                                <span className={`text-[0.95rem] font-medium whitespace-pre-line text-ellipsis`}>
                                                                                    {mgDatas.content}
                                                                                </span>
                                                                            </div>
                                                                            <span className="ml-auto text-[#484848] text-[0.9rem]">{formattedDate}</span>
                                                                        </div>
                                                                    )
                                                                })}
                                                        </div>
                                                        <button
                                                            className={`w-full h-[5rem] text-[2rem] border border-black mt-[1rem] flex items-center justify-center ${isMouseDown[Number(uid)] ? 'bg-gray-300' : 'bg-transparent'}`}
                                                            onMouseDown={() => {
                                                                setIsMouseDown((prev) => ({
                                                                    ...prev,
                                                                    [Number(uid)]: true,
                                                                }));
                                                                handleMicToggle(Number(uid), 'publish'); // 마이크 발행
                                                            }}
                                                            onMouseUp={() => {
                                                                setIsMouseDown((prev) => ({
                                                                    ...prev,
                                                                    [Number(uid)]: false,
                                                                }));
                                                                handleMicToggle(Number(uid), 'unpublish'); // 마이크 음소거
                                                            }}
                                                        >
                                                            {isMouseDown[Number(uid)] ? (
                                                                <Image className="w-[3rem] h-[3rem] flex items-center justify-center" width={30} height={30} src={micon} alt="" />
                                                            ) : (
                                                                <Image className="w-[3rem] h-[3rem] flex items-center justify-center" width={30} height={30} src={micoff} alt="" />
                                                            )}
                                                            말하기
                                                        </button>
                                                        <button className='w-full h-[5rem] text-[2rem] border border-black mt-[1rem] flex items-center justify-center ' onClick={handleCallEnd} >
                                                            <Image className='mr-[1rem]' src={calloff} alt='' />
                                                            통화종료
                                                        </button>
                                                    </div>

                                                </div>
                                                <div className='flex'>
                                                    <div className='flex flex-col'>
                                                        <div className='flex space-x-1 mt-[0.5rem]'>
                                                            <div className='border border-black p-[0.5rem]'>
                                                                {
                                                                    imageData && Object.values(imageData).map((arrayOfImages: any[], index: number) => {
                                                                        return (
                                                                            <div key={index} className='flex space-x-1'>
                                                                                {arrayOfImages[0]?.map((img: string, imgIndex: number) => (
                                                                                    <img
                                                                                        key={imgIndex} // 각 이미지의 고유 키
                                                                                        src={img} // Base64 이미지 데이터
                                                                                        width={100}
                                                                                        height={63}
                                                                                        alt={`Image ${imgIndex + 1}`}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                            <div className='flex space-x-1 border border-black p-[0.5rem]'>
                                                                {
                                                                    imageData && Object.values(imageData).map((arrayOfImages: any[], index: number) => {
                                                                        return (
                                                                            <div key={index} className='flex space-x-1'>
                                                                                {arrayOfImages[1]?.map((img: string, imgIndex: number) => (
                                                                                    <img
                                                                                        key={imgIndex} // 각 이미지의 고유 키
                                                                                        src={img} // Base64 이미지 데이터
                                                                                        width={100}
                                                                                        height={63}
                                                                                        alt={`Image ${imgIndex + 1}`}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {channelName.split('_')[0] === channelName.split('_')[1] && (
                                            <RoominfoSet2 channelName={uid} keyData={keyData} keyBoxRefetch={keyBoxRefetch} gtData={gtData} />
                                        )}
                                    </div>
                                </div>


                            </div>
                        );
                    })}
                </>
            )
            }

        </div >
    );
};

export default VideoComponent;
