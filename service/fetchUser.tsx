import axios from "axios";

const backenduri = process.env.NEXT_PUBLIC_API_KEY2

export const fetchMovementStatus = async (streamName: {}) => {
    try {
        const response = await axios.get(`${backenduri}/movement_status?stream_names=${streamName}`);
        return response.data;
    } catch (e) {
        return null
    }
};

export const getSimilarity = async (camera_num: string) => {
    try {
        const response = await axios.get(`${backenduri}/get_similarity_image?camera_num=${camera_num}`);
        return response.data;
    } catch (e) {
        return null;
    }

};