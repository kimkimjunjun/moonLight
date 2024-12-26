import React from 'react';
import { AgoraProvider } from '../components/AgoraContext';
import VideoComponent from '../components/VideoComponent';

interface JoinProps {
    appId: string;
    channelNames: string[];
    setActiveChannelNames: React.Dispatch<React.SetStateAction<string[]>>;
    data: []
}

export const Join = ({ appId, channelNames, setActiveChannelNames, data }: JoinProps) => {
    // console.log(channelNames)
    return (
        <AgoraProvider appId={appId} channelNames={channelNames}>
            <div className='flex flex-wrap'>
                <VideoComponent channelName="2" setActiveChannelNames={setActiveChannelNames} data={data} />
                <VideoComponent channelName="3" setActiveChannelNames={setActiveChannelNames} data={data} />
                {/* <VideoComponent channelName="10" setActiveChannelNames={setActiveChannelNames} /> */}
            </div>
        </AgoraProvider>
    );
};
