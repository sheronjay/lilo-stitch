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
        const response = await fetch(`${API_URL}/api/messages/${uuid}`);

        if (!response.ok) {
            console.warn('Failed to fetch message, using default');
            return defaultMessage;
        }

        const data = await response.json();
        return data.data.message;
    } catch (error) {
        console.error('Error fetching message:', error);
        return defaultMessage;
    }
}

// Load message based on URL parameter or use default
let message = defaultMessage;

const messageId = getUrlParameter('id');
if (messageId) {
    // Fetch message asynchronously
    message = await fetchMessage(messageId);
}

export { message };