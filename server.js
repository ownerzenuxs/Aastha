const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
  try {
    const { data } = await axios.get('https://aasthatv.tv');
    const $ = cheerio.load(data);

    let videoUrl = null;

    $('iframe').each((i, el) => {
      const title = $(el).attr('title') || '';
      const src = $(el).attr('src') || '';

      if (title.toUpperCase().startsWith('PUJYA PRADEEP') && src.includes('youtube')) {
        videoUrl = src.includes('autoplay') ? src : `${src}?autoplay=1&mute=1`;
        return false;
      }
    });

    if (!videoUrl) {
      return res.send('No "PUJYA PRADEEP" video found.');
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pujya Pradeep Video</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          #videoContainer {
            width: 100%;
            max-width: 100%;
            height: 100%;
            position: relative;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <div id="videoContainer"></div>
        <script>
          setTimeout(() => {
            const iframe = document.createElement("iframe");
            iframe.src = "${videoUrl}";
            iframe.allow = "autoplay; fullscreen";
            document.getElementById("videoContainer").appendChild(iframe);

            if (iframe.requestFullscreen) iframe.requestFullscreen();
            else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
            else if (iframe.mozRequestFullScreen) iframe.mozRequestFullScreen();
            else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
          }, 5000);
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching video:', error.message);
    res.status(500).send('Error loading video.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});