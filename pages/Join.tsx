import React from 'react';
import { AgoraProvider } from '../components/AgoraContext';
import VideoComponent from '../components/VideoComponent';

interface JoinProps {
    appId: string;
    channelNames: string[];
    setActiveChannelNames: React.Dispatch<React.SetStateAction<string[]>>;
    data: [];
    imageData: [];
}

const Join = ({ appId, channelNames, setActiveChannelNames, data, imageData }: JoinProps) => {
    return (
        <AgoraProvider appId={appId} channelNames={channelNames}>
            <div className='flex flex-wrap'>
                {/* <VideoComponent channelName="2" setActiveChannelNames={setActiveChannelNames} data={data} imageData={imageData} />
                <VideoComponent channelName="3" setActiveChannelNames={setActiveChannelNames} data={data} imageData={imageData} /> */}
                <VideoComponent channelName="13" channelNames={channelNames} setActiveChannelNames={setActiveChannelNames} data={data} imageData={imageData} />
            </div>
        </AgoraProvider>
    );
};

// 기본 내보내기 추가
export default Join;
