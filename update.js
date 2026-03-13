import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.fussballdaten.de/regionalliga/west/2025/";

async function scrape() {

const res = await axios.get(url);

const $ = cheerio.load(res.data);

const table = [];

$("table.standard_tabelle tbody tr").each((i,row)=>{

const cells = $(row).find("td");

if(cells.length < 10) return;

const team = $(cells[1]).text().trim();

table.push({
position: $(cells[0]).text().trim(),
team: team,
games: $(cells[2]).text().trim(),
wins: $(cells[3]).text().trim(),
draws: $(cells[4]).text().trim(),
losses: $(cells[5]).text().trim(),
goals: $(cells[6]).text().trim(),
points: $(cells[9]).text().trim()
});

});

fs.writeFileSync("table.json", JSON.stringify(table,null,2));

console.log("Tabelle aktualisiert:",table.length,"Teams");

}

scrape();
