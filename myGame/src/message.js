// Default message (fallback)
const defaultMessage = `Message not found. Please check your link.`;

// API configuration
const API_URL = window.env?.API_URL || 'http://localhost:3002';

// Function to get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch message from API
async function fetchMessage(uuid) {
    try {
        console.log(`Fetching message from: ${API_URL}/api/messages/${uuid}`);
        const response = await fetch(`${API_URL}/api/messages/${uuid}`);

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            console.warn('Failed to fetch message, using default');
            return defaultMessage;
        }

        const data = await response.json();
        console.log('Received data:', data);
        return data.data.message;
    } catch (error) {
        console.error('Error fetching message:', error);
        return defaultMessage;
    }
}

// Export a function that loads the message
export async function loadMessage() {
    const messageId = getUrlParameter('id');
    if (messageId) {
        console.log('Message ID found:', messageId);
        return await fetchMessage(messageId);
    }
    console.log('No message ID found, using default');
    return defaultMessage;
}

// For backwards compatibility, export default message
export let message = defaultMessage;