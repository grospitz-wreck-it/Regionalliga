import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url =
"https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3/saison_id/2025";

const LOGO_BASE =
"https://grospitz-wreck-it.github.io/Regionalliga/logos/";

const logos = {

"Wuppertaler SV": "wuppertal.png",
"Rot-Weiß Oberhausen": "rwo.png",
"SV Rödinghausen": "roedinghausen.png",
"Sportfreunde Lotte": "lotte.png",
"SC Paderborn II": "paderborn.png",
"Borussia Mönchengladbach II": "gladbach.png",
"Borussia Dortmund II": "dortmund.png",
"Fortuna Düsseldorf II": "f95.png",
"1. FC Köln II": "fckoeln.png",
"FC Gütersloh": "guetersloh.png",
"SV Wiedenbrück": "wiedenbrueck.png",
"SSVg Velbert": "velbert.png",
"FC Schalke 04 II": "schalke2.png",
"Sportfreunde Siegen": "siegen.png",
"Bonner SC": "bonn.png",
"VfL Bochum II": "bochum.png",
"1. FC Bocholt": "bocholt.png",
"Fortuna Köln": "fortuna-koeln.png"

};

async function updateTable(){

const {data}=await axios.get(url,{
headers:{ "User-Agent":"Mozilla/5.0" }
});

const $=cheerio.load(data);

const table=[];

$("table.items tbody tr").each((i,row)=>{

const cols=$(row).find("td");

if(cols.length<9) return;

const position=cols.eq(0).text().trim();
if(!position) return;

const team=$(row).find(".hauptlink a").text().trim();

const logoFile=logos[team] || "tmp";

const logo=LOGO_BASE+logoFile;

const games=Number(cols.eq(3).text().trim());
const wins=Number(cols.eq(4).text().trim());
const draws=Number(cols.eq(5).text().trim());
const losses=Number(cols.eq(6).text().trim());
const goals=cols.eq(7).text().trim();
const points=Number(cols.eq(8).text().trim());

table.push({
position:Number(position),
team,
logo,
games,
wins,
draws,
losses,
goals,
points
});

});

fs.writeFileSync(
"table.json",
JSON.stringify(table,null,2)
);

console.log("Regionalliga West Teams:",table.length);

}

updateTable();
