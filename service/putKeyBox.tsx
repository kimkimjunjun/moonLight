import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export default async function putKeyBox(keyData: {}) {
    try {
        const res = await axios.put(`/api/moon_light/storage/`, keyData);
        return res.data;
    } catch (e) {
        return null;
    }
}

export async function putGuest(moonlight_guest_id: number, process: number) {
    try {
        const res = await axios.put(`/api/moon_light/guest?moonlight_guest_id=${moonlight_guest_id}&process=${process}`);
        return res.data;
    } catch (e) {
        return null;
    }
}