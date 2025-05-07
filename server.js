const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = "https://aasthatv.tv/section/new_release";

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(TARGET_URL, { waitUntil: "networkidle2" });

    const videoUrl = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll("a"));
      const match = anchors.find((a) =>
        a.textContent.includes("PUJYA PRADEEP MISHRA")
      );
      return match ? match.href : null;
    });

    await browser.close();

    if (videoUrl) {
      res.redirect(videoUrl);
    } else {
      res.status(404).send("No 'PUJYA PRADEEP MISHRA' video found.");
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("Server error occurred.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});