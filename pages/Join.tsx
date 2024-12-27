import React from 'react';
import { AgoraProvider } from '../components/AgoraContext';
import VideoComponent from '../components/VideoComponent';

interface JoinProps {
    appId: string;
    channelNames: string[];
    setActiveChannelNames: React.Dispatch<React.SetStateAction<string[]>>;
    data: []
}

const Join = ({ appId, channelNames, setActiveChannelNames, data }: JoinProps) => {
    return (
        <AgoraProvider appId={appId} channelNames={channelNames}>
            <div className='flex flex-wrap'>
                <VideoComponent channelName="2" setActiveChannelNames={setActiveChannelNames} data={data} />
                <VideoComponent channelName="3" setActiveChannelNames={setActiveChannelNames} data={data} />
                <VideoComponent channelName="13" setActiveChannelNames={setActiveChannelNames} data={data} />
            </div>
        </AgoraProvider>
    );
};

// 기본 내보내기 추가
export default Join;
