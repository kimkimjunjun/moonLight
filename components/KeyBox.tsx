import CheckinModal from '@/modal/checkinModal';
import React, { useEffect, useState } from 'react'

interface RoomProps {
    channelName: any;
    keyData: any;
    keyBoxRefetch: any;
    gtData: any;
}

function RoominfoSet2({ channelName, keyData, keyBoxRefetch, gtData }: RoomProps) {
    const [roomIds, setRoomIds] = useState<number | null>(null);
    const [numberId, setNumberId] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [roomNames, setRoomNames] = useState('');
    const [guestNames, setGuestNames] = useState('');
    const [roomIded, setRoomIded] = useState(0);
    const [selecetData, setSelectData] = useState([]);


    const openModal = (data: any) => {
        setModalIsOpen(true);
        setRoomIds(data.id);
        setNumberId(data.number);
        setRoomNames(data.room?.name);
        if (data.guest_name) {
            setGuestNames(data.guest_name);
        }
        setSelectData(data);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    // const updateAcceptCheckId = (newId: number) => {
    //     setAcceptCheckIds((prevIds: any) => ({
    //         ...prevIds,
    //         [channelName]: newId, // 특정 channelName에 대한 값 업데이트
    //     }));
    // };

    // console.log(keyData)
    return (
        <div className='flex flex-col'>
            <div className="flex flex-col flex-wrap h-[25rem]">
                {keyData?.storages
                    .map((data: any, index: number) => {
                        const matchedRoomIds = gtData?.guests?.filter((guest: any) => guest.process === 1).map((guest: any) => guest.room_id) || [];
                        // const matchedGuestIds = gtData?.guests?.filter((guest: any) => guest.process === 1).map((guest: any) => guest.id) || [];
                        // updateAcceptCheckId(matchedGuestIds[0])
                        // 현재 data의 room_id가 matchedRoomIds에 포함되어 있는지 확인
                        const isBorderVisible = matchedRoomIds.includes(data.room_id);
                        return (
                            <div className={`border ${isBorderVisible ? " border-blue-400" : "border-none"}`} key={index}>
                                <div
                                    className={`w-[7.7rem] h-[6rem] cursor-pointer border-2 ${data.checkin_status === 1 ? "border-[#7584AE]" :
                                        data.room_id ? "border-[#75AE85]" : "border-[#F1F1F1]"} my-[0.2rem] mx-[0.3rem]`}

                                    onClick={() => { openModal(data); setRoomIded(data.room_id) }}
                                >
                                    <div className={`w-full text-[0.8rem] flex ${data.checkin_status === 1 ? "bg-[#7584AE] text-white" : data.room_id ? "bg-[#75AE85] text-white" : "bg-[#F1F1F1] text-black"}`}>
                                        <h1 className='font-semibold flex mx-auto'>{index + 1}</h1>
                                    </div>
                                    <div className='flex flex-col p-[0.3rem] text-[0.8rem]'>
                                        <div className='flex'>
                                            {data.room?.name && (
                                                <span className='font-semibold'>{data.room?.name}호</span>
                                            )}

                                        </div>
                                        {data.price > 0 && (
                                            <div className='flex'>
                                                <span className='font-semibold'>{data.price}원</span>
                                            </div>
                                        )}
                                        <div className='flex'>
                                            <span className='font-semibold'>{data.guest_name}</span>
                                        </div>
                                        {data.memo !== "" && (
                                            <div className='flex'>
                                                <span className='font-semibold'>{data.memo}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <CheckinModal modalIsOpen={modalIsOpen} closeModal={closeModal} hotelId={channelName} roomIds={Number(roomIds)} keyBoxRefetch={keyBoxRefetch} numberId={numberId} roomNames={roomNames} guestNames={guestNames} setGuestNames={setGuestNames} roomIded={roomIded} selecetData={selecetData} />
        </div >
    )
}

export default RoominfoSet2