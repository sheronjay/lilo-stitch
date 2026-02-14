// Default message (fallback)
const defaultMessage = `Message not found. Please check your link.`;

// API configuration
const API_URL = window.env?.API_URL || 'http://localhost:3002';

// CRITICAL: Capture the ID immediately when the module loads, before any redirects!
const capturedMessageId = (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('🔍 Captured message ID at module load time:', id);
    console.log('🔍 Full URL at module load:', window.location.href);
    return id;
})();

// Function to get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch message from API
async function fetchMessage(uuid) {
    try {
        const fetchUrl = `${API_URL}/api/messages/${uuid}`;
        console.log(`🌐 Fetching message from: ${fetchUrl}`);
        console.log(`🌐 API_URL: ${API_URL}`);
        
        const response = await fetch(fetchUrl);

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            console.warn('❌ Failed to fetch message, using default. Status:', response.status);
            return defaultMessage;
        }

        const data = await response.json();
        console.log('✅ Received data:', data);
        
        if (data && data.data && data.data.message) {
            console.log('✅ Message extracted:', data.data.message);
            return data.data.message;
        } else {
            console.warn('⚠️ Unexpected data structure:', data);
            return defaultMessage;
        }
    } catch (error) {
        console.error('❌ Error fetching message:', error);
        return defaultMessage;
    }
}

// Export a function that loads the message
export async function loadMessage() {
    // Use the captured ID instead of trying to get it from current URL
    const messageId = capturedMessageId;
    
    console.log('💬 loadMessage() called');
    console.log('💬 Using captured message ID:', messageId);
    console.log('💬 Current URL:', window.location.href);
    
    if (messageId) {
        console.log('✅ Message ID found, fetching from API...');
        return await fetchMessage(messageId);
    }
    console.warn('⚠️ No message ID found, using default');
    return defaultMessage;
}

// For backwards compatibility, export default message
export let message = defaultMessage;