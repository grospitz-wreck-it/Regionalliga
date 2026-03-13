
import puppeteer from "puppeteer";
import fs from "fs";

const url =
"https://www.fussball.de/spieltag/regionalliga-west-deutschland-regionalliga-west-herren/";

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.goto(url, { waitUntil: "networkidle2" });

const table = await page.evaluate(() => {

const rows = document.querySelectorAll("table tbody tr");

return Array.from(rows).map(row => {

const cells = row.querySelectorAll("td");

return {
position: parseInt(cells[0].innerText),
team: cells[2].innerText.trim(),
games: parseInt(cells[3].innerText),
wins: parseInt(cells[4].innerText),
draws: parseInt(cells[5].innerText),
losses: parseInt(cells[6].innerText),
goals: cells[7].innerText,
points: parseInt(cells[9].innerText)
};

});

});

fs.writeFileSync("table.json", JSON.stringify(table, null, 2));

await browser.close();
