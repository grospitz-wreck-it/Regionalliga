import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url =
"https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3/saison_id/2025";

const LOGO_BASE =
"https://grospitz-wreck-it.github.io/Regionalliga/logos/";

/*
Teamname → Logo-Datei
(diese Namen entsprechen deinen Dateien im logos-Ordner)
*/
const logos = {

"1. FC Bocholt": "bocholt.png",
"1. FC Düren": "dueren.png",
"1. FC Köln II": "koeln2.png",
"Borussia Dortmund II": "bvb2.png",
"Borussia Mönchengladbach II": "gladbach2.png",
"FC Gütersloh": "guetersloh.png",
"FC Schalke 04 II": "schalke2.png",
"Fortuna Düsseldorf II": "f95.png",
"Fortuna Köln": "fortuna-koeln.png",
"Rot-Weiß Oberhausen": "rwo.png",
"SC Paderborn II": "paderborn2.png",
"Sportfreunde Lotte": "lotte.png",
"SV Rödinghausen": "roedinghausen.png",
"SV Wiedenbrück": "wiedenbrueck.png",
"Wuppertaler SV": "wuppertal.png",
"SSVg Velbert": "velbert.png"

};

async function updateTable(){

try{

const {data}=await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

const $=cheerio.load(data);

const table=[];

$("table.items tbody tr").each((i,row)=>{

const cols=$(row).find("td");

if(cols.length<9) return;

const position=cols.eq(0).text().trim();
if(!position) return;

const team=$(row).find(".hauptlink a").text().trim();

const logoFile=logos[team] || "default.png";

const logo=LOGO_BASE + logoFile;

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

}catch(err){

console.error("Fehler:",err.message);

}

}

updateTable();
