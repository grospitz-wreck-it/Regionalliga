import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";

const url = "https://www.kicker.de/regionalliga-west/tabelle";

async function scrape() {

const { data } = await axios.get(url);

const $ = cheerio.load(data);

let table = [];

$("table tbody tr").each((i, el) => {

const cells = $(el).find("td");

table.push({
position: parseInt($(cells[0]).text().trim()),
team: $(cells[1]).text().trim(),
games: parseInt($(cells[2]).text().trim()),
wins: parseInt($(cells[3]).text().trim()),
draws: parseInt($(cells[4]).text().trim()),
losses: parseInt($(cells[5]).text().trim()),
goals: $(cells[6]).text().trim(),
points: parseInt($(cells[8]).text().trim())
});

});

fs.writeFileSync("table.json", JSON.stringify(table, null, 2));

}

scrape();
