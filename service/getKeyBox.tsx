import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export default async function getKeyBox(hotel_id: number) {
    try {
        const res = await axios.get(`/api/moon_light/storage/many?hotel_id=${hotel_id}`);
        console.log(res)
        return res.data;
    } catch (e) {
        return null;
    }
}

export const getRoomNameId = async (room_name: string, hotel_id: number) => {
    try {
        const res = await axios.get(`/api/hotel/room/one/name?room_name=${room_name}&hotel_id=${hotel_id}`)
        return res.data;
    } catch (e) {
        return null;
    }
}

export async function getMessageIntro(hotel_id: number) {
    try {
        const res = await axios.get(`/api/moon_light/notice/many?hotel_id=${hotel_id}`);
        return res.data;
    } catch (e) {
        return null
    }
}

export async function getGuestMany(hotel_id: number) {
    try {
        const res = await axios.get(`/api/moon_light/guest/many?hotel_id=${hotel_id}`);
        return res.data;
    } catch (e) {
        return null
    }
}
