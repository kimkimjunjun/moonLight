import React, { useRef, useState } from 'react';
import { AgoraProvider } from '../components/AgoraContext';
import VideoComponent from '../components/VideoComponent';

interface JoinProps {
    appId: string;
    channelNames: string[];
    setActiveChannelNames: React.Dispatch<React.SetStateAction<string[]>>;
    imageData: [];
    activeChannelNames: string[];
}

const Join = ({ appId, channelNames, setActiveChannelNames, imageData, activeChannelNames }: JoinProps) => {
    // 각 VideoComponent에 대한 refs 생성
    const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [channelNamed] = useState(["4_4", "13_13", "13_14", "14_14", "14_15", "2_2"]);

    // 버튼 클릭 시 해당 VideoComponent로 스크롤하는 함수
    const scrollToVideo = (index: number) => {
        if (videoRefs.current[index]) {
            videoRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <AgoraProvider appId={appId} channelNames={channelNames}>
            <div className="flex">
                {/* 버튼 영역 */}
                <div className="flex flex-col fixed right-4 top-10">
                    {channelNamed.map((channelName, index) => {
                        // activeChannelNames에 포함되어 있는지 확인
                        const isActive = activeChannelNames?.includes(channelName);

                        // channelName에 따라 보여줄 이름 설정
                        let displayName;
                        switch (channelName) {
                            case '4_4':
                                displayName = '아띠';
                                break;
                            case '13_13':
                                displayName = '두루와';
                                break;
                            case '13_14':
                                displayName = '두루와서브';
                                break;
                            case '14_14':
                                displayName = '뉴캐슬';
                                break;
                            case '14_15':
                                displayName = '뉴캐슬서브';
                                break;

                            default:
                                displayName = channelName; // 기본값: 원래 이름 사용
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => scrollToVideo(index)}
                                className={`mb-2 p-4 text-[1.6rem] rounded text-white ${isActive ? 'bg-red-500' : 'bg-blue-500'}`} // 조건부 클래스
                            >
                                {displayName}
                            </button>
                        );
                    })}
                </div>


                {/* VideoComponent 영역 */}
                <div className="flex flex-wrap ml-4">
                    {channelNamed.map((channelName, index) => (
                        <div
                            key={index}
                            ref={(el) => { videoRefs.current[index] = el; }} // ref를 올바르게 설정
                            className="mb-4"
                        >
                            <VideoComponent
                                channelName={channelName}
                                channelNames={channelNames}
                                setActiveChannelNames={setActiveChannelNames}
                                imageData={imageData}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </AgoraProvider>
    );
};

// 기본 내보내기 추가
export default Join;
