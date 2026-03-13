import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url =
"https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3/saison_id/2025";

const LOGO_BASE =
"https://grospitz-wreck-it.github.io/Regionalliga/logos/";

function normalize(text){

return text
.toLowerCase()
.replace(/ä/g,"ae")
.replace(/ö/g,"oe")
.replace(/ü/g,"ue")
.replace(/ß/g,"ss");

}

function findLogo(team){

const t = normalize(team);

if(t.includes("wuppertal")) return "wuppertal.png";
if(t.includes("oberhausen")) return "rwo.png";
if(t.includes("roedinghausen")) return "roedinghausen.png";
if(t.includes("lotte")) return "lotte.png";
if(t.includes("paderborn")) return "paderborn.png";
if(t.includes("gladbach")) return "gladbach.png";
if(t.includes("dortmund")) return "dortmund.png";
if(t.includes("duesseldorf")) return "f95.png";
if(t.includes("koeln ii")) return "fckoeln.png";
if(t.includes("fortuna koeln")) return "fortuna-koeln.png";
if(t.includes("guetersloh")) return "guetersloh.png";
if(t.includes("wiedenbrueck")) return "wiedenbrueck.png";
if(t.includes("velbert")) return "velbert.png";
if(t.includes("schalke")) return "schalke2.png";
if(t.includes("siegen")) return "siegen.png";
if(t.includes("bonn")) return "bonn.png";
if(t.includes("bochum")) return "bochum.png";
if(t.includes("bocholt")) return "bocholt.png";

return "tmp";
}

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

const logoFile=findLogo(team);

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
