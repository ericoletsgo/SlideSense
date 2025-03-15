// This file contains the background script for the Chrome extension. It runs in the background and can handle events, manage state, and communicate with other parts of the extension.

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Add more background script functionality as needed.