const button = document.querySelector('.myButton');

button.addEventListener('click', ()=> {
        // Handle button click
        alert('Button clicked!');
        chrome.tabs.query({active:true}, (tab) => {
            chrome.scripting.executeScript({
                target: {tabId: tab[0].id},
                files: ["src/content.js"]
            })  
        })
});