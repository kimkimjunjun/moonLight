
export const fetchMovementStatus = async (streamName: {}) => {
    const response = await fetch(`http://127.0.0.1:5000/movement_status/${streamName}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};