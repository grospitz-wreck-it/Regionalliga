import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.fussballdaten.de/regionalliga/west/2025/";

const logos = {
"Rot-Weiß Oberhausen":"https://upload.wikimedia.org/wikipedia/de/thumb/5/5b/Rot-Weiss_Oberhausen_logo.svg/120px-Rot-Weiss_Oberhausen_logo.svg.png",
"MSV Duisburg":"https://upload.wikimedia.org/wikipedia/de/thumb/3/3c/MSV_Duisburg_Logo.svg/120px-MSV_Duisburg_Logo.svg.png",
"Fortuna Köln":"https://upload.wikimedia.org/wikipedia/de/thumb/8/8f/SC_Fortuna_K%C3%B6ln_logo.svg/120px-SC_Fortuna_K%C3%B6ln_logo.svg.png",
"Wuppertaler SV":"https://upload.wikimedia.org/wikipedia/de/thumb/7/74/Wuppertaler_SV_Logo.svg/120px-Wuppertaler_SV_Logo.svg.png",
"Alemannia Aachen":"https://upload.wikimedia.org/wikipedia/de/thumb/6/6b/Alemannia_Aachen_Logo.svg/120px-Alemannia_Aachen_Logo.svg.png"
};

async function scrape(){

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
logo: logos[team] || "",
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
