
const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://aasthatv.tv/section/new_release', { waitUntil: 'networkidle2' });

    const videoUrl = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      const target = anchors.find(a => a.textContent.toUpperCase().includes('PUJYA PRADEEP'));
      return target ? target.href : null;
    });

    await browser.close();

    if (videoUrl) {
      res.send(`
        <html>
          <head>
            <meta http-equiv="refresh" content="5;url=${videoUrl}" />
            <style>body,html{margin:0;padding:0;height:100%;display:flex;align-items:center;justify-content:center;font-family:sans-serif;background:#000;color:#fff}</style>
          </head>
          <body>
            <h1>Redirecting to the latest PUJYA PRADEEP video...</h1>
            <script>
              setTimeout(() => {
                const iframe = document.createElement('iframe');
                iframe.src = '${videoUrl}';
                iframe.style.position = 'fixed';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                document.body.appendChild(iframe);
              }, 5000);
            </script>
          </body>
        </html>
      `);
    } else {
      res.send('No "PUJYA PRADEEP" video found.');
    }
  } catch (err) {
    res.status(500).send('Error occurred: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
