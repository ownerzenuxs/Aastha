const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://aasthatv.tv/section/new_release', { waitUntil: 'networkidle2' });

    const videoLink = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      const matching = anchors.find(a =>
        a.textContent.trim().startsWith('PUJYA PRADEEP')
      );
      return matching ? matching.href : null;
    });

    await browser.close();

    if (!videoLink) {
      return res.send('No "PUJYA PRADEEP" video found.');
    }

    res.send(\`
      <html>
        <head>
          <title>Redirecting...</title>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: sans-serif;
              background: #000;
              color: #fff;
            }
          </style>
        </head>
        <body>
          <div>Loading latest "PUJYA PRADEEP" video in 5 seconds...</div>
          <script>
            setTimeout(() => {
              window.location.href = "\${videoLink}";
            }, 5000);
          </script>
        </body>
      </html>
    \`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
});

app.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`);
});