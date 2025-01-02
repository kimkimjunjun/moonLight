import React from 'react';
import { AgoraProvider } from '../components/AgoraContext';
import VideoComponent from '../components/VideoComponent';

interface JoinProps {
    appId: string;
    channelNames: string[];
    setActiveChannelNames: React.Dispatch<React.SetStateAction<string[]>>;
    imageData: [];
}

const Join = ({ appId, channelNames, setActiveChannelNames, imageData }: JoinProps) => {
    return (
        <AgoraProvider appId={appId} channelNames={channelNames}>
            <div className='flex flex-wrap'>

                {/* <VideoComponent channelName="3" setActiveChannelNames={setActiveChannelNames} data={data} imageData={imageData} /> */}
                <VideoComponent channelName="13_13" channelNames={channelNames} setActiveChannelNames={setActiveChannelNames} imageData={imageData} />
                <VideoComponent channelName="13_14" channelNames={channelNames} setActiveChannelNames={setActiveChannelNames} imageData={imageData} />
                {/* <VideoComponent channelName="14_14" channelNames={channelNames} setActiveChannelNames={setActiveChannelNames} imageData={imageData} />
                <VideoComponent channelName="15_15" channelNames={channelNames} setActiveChannelNames={setActiveChannelNames} imageData={imageData} />
                <VideoComponent channelName="16_16" channelNames={channelNames} setActiveChannelNames={setActiveChannelNames} imageData={imageData} /> */}
                <VideoComponent channelName="2_2" channelNames={channelNames} setActiveChannelNames={setActiveChannelNames} imageData={imageData} />
            </div>
        </AgoraProvider>
    );
};

// 기본 내보내기 추가
export default Join;
