import React, { useEffect, useState } from 'react';
import { Join } from './Join';
import { fetchMovementStatus } from '@/service/fetchUser';
import { useQuery } from 'react-query';

const HomePage = () => {
  const [appId] = useState('5c8ac8416ead4829aa0fa3c9767ea7cb');
  const [streamNames] = useState<string[]>(['2', '2_1', '3', '3_1']); // 스트림 이름을 문자열 배열로 초기화
  const [activeChannelNames, setActiveChannelNames] = useState<string[]>([]); // 활성화된 채널 이름 배열

  const { data } = useQuery(
    ['movementStatus', streamNames],
    () => fetchMovementStatus(streamNames.join(',')), // 배열을 문자열로 변환하여 요청
    {
      refetchInterval: 1000, // 1초마다 새로 고침
      enabled: streamNames.length > 0, // streamNames가 비어있지 않을 때만 쿼리 실행
    }
  );

  // data가 업데이트될 때마다 activeChannelNames를 업데이트
  useEffect(() => {
    if (data) {
      const newActiveChannels: string[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (value === true) {
          // 2 또는 2_1이 true인 경우
          if (key === '2' || key === '2_1') {
            newActiveChannels.push('2');
          }
          // 10 또는 10_1이 true인 경우
          else if (key === '3' || key === '3_1') {
            newActiveChannels.push('3');
          }
        }
      });

      // 중복된 채널을 제거하고 상태 업데이트
      const uniqueChannels = [...new Set(newActiveChannels)];
      const hasNewChannels = uniqueChannels.some(channel => !activeChannelNames.includes(channel));

      if (hasNewChannels) {
        setActiveChannelNames((prev) => {
          const updatedChannels = new Set(prev); // 기존 채널을 Set으로 변환하여 중복 제거
          uniqueChannels.forEach(channel => updatedChannels.add(channel)); // 새로운 채널 추가
          return Array.from(updatedChannels); // Set을 배열로 변환하여 상태 업데이트
        });
      }
    }
  }, [data, activeChannelNames]);

  console.log(data, activeChannelNames)

  return (
    <div>
      {/* {streamNames.map((streamName) => (
        <img
          key={streamName} // 고유한 키를 제공
          className='hidden'
          src={`http://localhost:5000/video_feed/${streamName}`}
          alt=''
          width="400"
          height="221"
        />
      ))} */}

      {appId && <Join appId={appId} channelNames={activeChannelNames} setActiveChannelNames={setActiveChannelNames} data={data} />}
    </div>
  );
};

export default HomePage;
