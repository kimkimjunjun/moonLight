import React, { useEffect, useState } from 'react';
import Join from './Join';
import { fetchMovementStatus, getSimilarity, putUpdateImg } from '@/service/fetchUser';
import { useQuery } from 'react-query';

const HomePage = () => {
    const [appId] = useState('5c8ac8416ead4829aa0fa3c9767ea7cb');
    const [streamNames] = useState<string[]>(['camera13', 'camera13_1', 'camera13_2', 'camera13_3', 'camera14', 'camera14_1', 'camera14_2', 'camera15', 'camera15_1', 'camera15_2', 'camera16', 'camera16_1', 'camera16_2']); // 스트림 이름을 문자열 배열로 초기화
    const [activeChannelNames, setActiveChannelNames] = useState<string[]>(['2_2', '10_10']); // 활성화된 채널 이름 배열
    const [cameraNum, setCameraNum] = useState('');

    const { data } = useQuery(
        ['movementStatus', streamNames],
        () => fetchMovementStatus(streamNames.join(',')), // 배열을 문자열로 변환하여 요청
        {
            refetchInterval: 1000, // 1초마다 새로 고침
            enabled: streamNames.length > 0, // streamNames가 비어있지 않을 때만 쿼리 실행
        }
    );

    // useEffect(() => {
    //   if (data) {
    //     // cameraNum을 업데이트할 변수
    //     let newCameraNum = '';

    //     // data에서 조건에 맞는 카메라 번호 찾기
    //     for (const [key, value] of Object.entries(data)) {
    //       if (value === true) {
    //         // key가 '2'이고, '2_1'은 false인 경우

    //         if (key === 'camera13_1' || key === 'camera13_2') {
    //           newCameraNum = 'camera13_3';
    //         }
    //         else if (key === 'camera13_1' || key === 'camera13_2' && data['camera13'] === false) {
    //           putUpdateImg("camera13");
    //         }
    //       }
    //     }

    //     // cameraNum이 변경되었을 때만 업데이트
    //     if (newCameraNum && newCameraNum !== cameraNum) {
    //       setCameraNum(newCameraNum);

    //       // 10초 후에 cameraNum을 빈 문자열로 설정
    //       const timeoutId = setTimeout(() => {
    //         setCameraNum('');
    //       }, 10000);

    //       // cleanup function to clear the timeout if the component unmounts or if data changes
    //       return () => clearTimeout(timeoutId);
    //     }
    //   }
    // }, [data, cameraNum]);

    const { data: imageData } = useQuery({
        queryKey: ['imgData'],
        queryFn: () => getSimilarity(cameraNum),
        enabled: !!cameraNum
    })
    console.log(imageData, cameraNum)
    // data가 업데이트될 때마다 activeChannelNames를 업데이트
    useEffect(() => {
        if (data) {
            const newActiveChannels: string[] = [];

            Object.entries(data).forEach(([key, value]) => {
                if (value === true) {
                    // 2 또는 2_1이 true인 경우

                    if (key === 'camera13_1' || key === 'camera13_2') {
                        newActiveChannels.push('2_2');
                        newActiveChannels.push('2_2');
                    }
                    if (key === 'camera14_1' || key === 'camera14_2') {
                        newActiveChannels.push('2_2');
                    }
                    if (key === 'camera15_1' || key === 'camera15_2') {
                        newActiveChannels.push('2_2');
                    }
                    if (key === 'camera16_1' || key === 'camera16_2') {
                        newActiveChannels.push('2_2');
                    }
                    // else if (key === 'camera13_1' || key === 'camera13_2') {

                    // }
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

            {appId && <Join appId={appId} channelNames={activeChannelNames} setActiveChannelNames={setActiveChannelNames} imageData={imageData} activeChannelNames={activeChannelNames} />}
        </div>
    );
};

export default HomePage;
