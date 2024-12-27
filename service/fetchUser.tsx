import axios from "axios";

// const backenduri = process.env.NEXT_PUBLIC_API_KEY2

export const fetchMovementStatus = async (streamName: {}) => {
    const response = await fetch(`http://localhost:8000/movement_status?stream_names=${streamName}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const getSimilarity = async (camera_num: string) => {
    try {
        const response = await axios.get(`http://localhost:8000/get_similarity_image?camera_num=${camera_num}`);
        return response.data;
    } catch (e) {
        return null;
    }

};

export const putUpdateImg = async (camera_num: string) => {
    try {
        const res = await axios.put(`http://localhost:8000/update_image_dataset?camera_num=${camera_num}`);
        console.log(res)
        return res.data
    } catch (e) {
        return null;
    }
}