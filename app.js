const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

const personName = "PUJYA PRADEEP MISHRA JI"; // Name to search for

// Function to scrape the video URL for the specific person
async function fetchVideoUrl() {
    try {
        const url = 'https://aasthatv.tv/section/new_release';  // Corrected URL
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Search for the video URL (adjust the selector as needed)
        // Example: Find a video container that contains the specific person's name
        const videoElement = $('div:contains("PRADEEP MISHRA") iframe');  // Adjust the selector

        if (videoElement.length > 0) {
            const videoUrl = videoElement.attr('src');
            return videoUrl;  // Return the video URL
        } else {
            return null;  // Video not found
        }
    } catch (error) {
        console.error('Error fetching video URL:', error);
        return null;
    }
}

// Route to display the video with message
app.get('/', async (req, res) => {
    const videoUrl = await fetchVideoUrl();

    if (videoUrl) {
        const startTime = 10;  // Set the start time in seconds
        const embeddedVideoUrl = `${videoUrl}?start=${startTime}`; // Modify the URL to start at specific time
        
        // HTML to show the message and video
        res.send(`
            <html>
            <head><title>Video Page</title></head>
            <body>
                <div style="font-size: 24px; color: #ff4500; margin-bottom: 20px;">
                    ${personName}
                </div>
                <iframe src="${embeddedVideoUrl}" width="560" height="315" frameborder="0" allowfullscreen></iframe>
            </body>
            </html>
        `);
    } else {
        res.send('Video not found for the specified person.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
