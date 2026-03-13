import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.fussballdaten.de/regionalliga/west/2025/";

const logos = {
"MSV Duisburg":"https://upload.wikimedia.org/wikipedia/de/3/3c/MSV_Duisburg_Logo.svg",
"Rot-Weiß Oberhausen":"https://upload.wikimedia.org/wikipedia/de/5/5b/Rot-Weiss_Oberhausen_logo.svg",
"Fortuna Köln":"https://upload.wikimedia.org/wikipedia/de/8/8f/SC_Fortuna_K%C3%B6ln_logo.svg",
"Wuppertaler SV":"https://upload.wikimedia.org/wikipedia/de/7/74/Wuppertaler_SV_Logo.svg",
"1. FC Bocholt":"https://upload.wikimedia.org/wikipedia/de/f/f1/1._FC_Bocholt_Logo.svg",
"Schalke 04 II":"https://upload.wikimedia.org/wikipedia/de/4/43/FC_Schalke_04_Logo.svg",
"Borussia Mönchengladbach II":"https://upload.wikimedia.org/wikipedia/de/8/81/Borussia_M%C3%B6nchengladbach_logo.svg",
"Fortuna Düsseldorf II":"https://upload.wikimedia.org/wikipedia/de/9/9d/Fortuna_D%C3%BCsseldorf_Logo.svg",
"1. FC Düren":"https://upload.wikimedia.org/wikipedia/de/6/6a/1._FC_D%C3%BCren_Logo.svg",
"SV Rödinghausen":"https://upload.wikimedia.org/wikipedia/de/8/86/SV_R%C3%B6dinghausen_Logo.svg",
"SC Wiedenbrück":"https://upload.wikimedia.org/wikipedia/de/4/47/SC_Wiedenbrueck_logo.svg",
"Rot Weiss Ahlen":"https://upload.wikimedia.org/wikipedia/de/7/74/Rot_Weiss_Ahlen_Logo.svg",
"KFC Uerdingen":"https://upload.wikimedia.org/wikipedia/de/7/7e/KFC_Uerdingen_05_Logo.svg",
"Preußen Münster II":"https://upload.wikimedia.org/wikipedia/de/4/4a/SC_Preu%C3%9Fen_M%C3%BCnster_Logo.svg",
"SSVg Velbert":"https://upload.wikimedia.org/wikipedia/de/6/60/SSVg_Velbert_Logo.svg",
"Sportfreunde Lotte":"https://upload.wikimedia.org/wikipedia/de/3/39/Sportfreunde_Lotte_Logo.svg"
};

async function scrape(){

const res = await axios.get(url);

const $ = cheerio.load(res.data);

const table=[];

$("table.standard_tabelle tbody tr").each((i,row)=>{

const cells=$(row).find("td");

if(cells.length<10) return;

const team=$(cells[1]).text().trim();

table.push({

position:$(cells[0]).text().trim(),
team:team,
logo:logos[team] || "",
games:$(cells[2]).text().trim(),
wins:$(cells[3]).text().trim(),
draws:$(cells[4]).text().trim(),
losses:$(cells[5]).text().trim(),
goals:$(cells[6]).text().trim(),
points:$(cells[9]).text().trim()

});

});

fs.writeFileSync("table.json",JSON.stringify(table,null,2));

console.log("Tabelle aktualisiert");

}

scrape();
