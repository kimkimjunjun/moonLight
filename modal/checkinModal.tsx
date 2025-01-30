import putKeyBox, { putGuest } from "@/service/putKeyBox";
import MyModal from "./baseModal";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getRoomNameId } from "@/service/getKeyBox";

interface EmploProps {
    modalIsOpen: boolean;
    closeModal: () => void;
    hotelId: number;
    roomIds: number;
    keyBoxRefetch: any;
    numberId: number;
    roomNames: string;
    guestNames: string;
    setGuestNames: any;
    roomIded: number;
    selecetData: any;
    pricex: number;
}

export default function CheckinModal({ modalIsOpen, closeModal, hotelId, roomIds, keyBoxRefetch, numberId, roomNames, guestNames, setGuestNames, roomIded, selecetData, pricex }: EmploProps) {
    const [roomName, setRoomName] = useState('');
    const [reserName, setReserName] = useState('');
    const [roomIdx, setRoomIdx] = useState<number | null>(null); // roomIdx를 null로 초기화

    useEffect(() => {
        if (selecetData) {
            setRoomName(selecetData.room_name);
            setReserName(selecetData.guest_name);
        }
    }, [selecetData]);

    const { data: roomNData, refetch: nameRefetch } = useQuery({
        queryKey: ['roomNdata', roomNames], // roomName을 queryKey에 추가하여 변경 시 refetch
        queryFn: () => getRoomNameId(roomNames, hotelId),
        enabled: !!roomNames // roomName이 있을 때만 쿼리 실행
    });
    console.log(selecetData)
    const boxHandler = async () => {

        const boxData = {
            storage_id: roomIds,
            number: numberId,
            room_id: roomIded, // roomIdx 사용
            checkin_status: 1,
            is_booked: reserName ? 1 : 0, // reserName이 존재하면 1, 그렇지 않으면 0
            is_paid: reserName ? 1 : 0,
            ...(reserName && { guest_name: reserName }), // reserName이 존재하면 guest_name 추가
            has_key: 1,
            price: pricex
        };

        try {
            console.log(boxData, roomIded);
            await putKeyBox(boxData);
            closeModal();
            setTimeout(() => {
                setRoomName('');
                setReserName('');
                setGuestNames('');
                keyBoxRefetch();
            }, 500);
        } catch (e) {
            console.error(e);
            return null;
        }
    };


    const closeKeyModal = () => {
        closeModal();
        setRoomName('');
        setReserName('');
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

    return (
        <MyModal isOpen={modalIsOpen} closeModal={closeModal}>
            <div className="w-[25rem] h-[25rem] bg-white flex flex-col m-auto z-20">
                <div className="flex flex-col mx-auto mt-[3rem]">
                    <div className="flex text-[2rem] font-bold">
                        <span className="mr-[1rem]">객실번호</span>
                        <div className={`bg-[#F0F0F0] border ${roomName !== "" && !roomNData ? "border-[#D32525]" : "border-none"} flex rounded-[1rem] px-[1rem]`}>
                            {roomNames}호
                        </div>
                    </div>

                    <div className="flex text-[2rem] font-bold mt-[1rem]">
                        <span className="mr-[1rem]">예약자명</span>
                        <input
                            className="bg-[#F0F0F0] outline-none w-[16rem] flex rounded-[1rem] px-[1rem]"
                            type="text"
                            value={reserName} // guestNames가 존재하면 그 값을 사용, 아니면 reserName 사용
                            onChange={(e) => {
                                setReserName(e.target.value); // 입력값 변경 시 reserName 업데이트
                            }}
                        />
                    </div>
                    <div className="flex text-[2rem] font-bold mt-[1rem]">
                        <span className="mr-[1rem] text-red-500">가격: {pricex}원</span>
                    </div>
                </div>
                <span className="mx-auto text-[#D32525] text-[2rem] font-bold mt-[1rem]">예약자분 성함이 틀리지 않도록 주의해주세요 !</span>
                <div className="flex mx-auto mb-[3rem] text-[2rem]">
                    <button className="border border-[#858585] w-[15rem] py-[0.4rem] px-[1rem] rounded-[1rem]" onClick={closeKeyModal}>취소</button>
                    <button className={`${roomNData ? "bg-[#575A7C] border-[#575A7C]" : "bg-[#858585] border-[#858585]"} border text-black w-[15rem] py-[0.4rem] rounded-[1rem] ml-[1rem] transition-all duration-200 px-[1rem]`} onClick={boxHandler}>입력 완료</button>
                </div>
            </div>
        </MyModal>
    )
}