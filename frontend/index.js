// filepath: /my-js-project/my-js-project/src/js/app.js
document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const uploadButton = document.getElementById("uploadButton");
    const extractedText = document.getElementById("extractedText");

    uploadButton.addEventListener("click", async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert("Please upload a PowerPoint file.");
            return;
        }

        const formData = new FormData();
        formData.append("pptx", file);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            extractedText.innerHTML = data.slidesText.split(" ").map((word, i) => {
                return `<span style="cursor: pointer; color: ${data.keywords.includes(word.toLowerCase()) ? "blue" : "black"};" title="${data.definitions[word.toLowerCase()] || ""}">${word}</span>`;
            }).join(" ");
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    });
});