import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const URL =
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

const t=normalize(team);

if(t.includes("wuppertal")) return "wuppertal.png";
if(t.includes("oberhausen")) return "rwo.png";
if(t.includes("roedinghausen")) return "roedinghausen.png";
if(t.includes("lotte")) return "lotte.png";
if(t.includes("paderborn")) return "paderborn.png";
if(t.includes("gladbach")) return "gladbach.png";
if(t.includes("dortmund")) return "dortmund.png";
if(t.includes("duesseldorf")) return "f95.png";
if(t.includes("koeln") && !t.includes("fortuna")) return "fckoeln.png";
if(t.includes("fortuna koeln")) return "fortuna-koeln.png";
if(t.includes("guetersloh")) return "guetersloh.png";
if(t.includes("wiedenbrueck")) return "wiedenbrueck.png";
if(t.includes("velbert")) return "velbert.png";
if(t.includes("schalke")) return "schalke2.png";
if(t.includes("siegen")) return "siegen.png";
if(t.includes("bonn")) return "bonn.png";
if(t.includes("bochum")) return "bochum.png";
if(t.includes("bocholt")) return "bocholt.png";

return "placeholder.png";
}

async function updateTable(){

const {data} = await axios.get(URL,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

const $ = cheerio.load(data);

const table=[];

$("table.items tbody tr").each((i,row)=>{

const position=$(row).find("td").eq(0).text().trim();

const team=$(row).find(".hauptlink a").text().trim();

const games=$(row).find("td").eq(3).text().trim();

const wins=$(row).find("td").eq(4).text().trim();

const draws=$(row).find("td").eq(5).text().trim();

const losses=$(row).find("td").eq(6).text().trim();

const goals=$(row).find("td").eq(7).text().trim();

const points=$(row).find("td").eq(8).text().trim();

if(!team) return;

table.push({

position:Number(position),

team,

logo:LOGO_BASE+findLogo(team),

games:Number(games),

wins:Number(wins),

draws:Number(draws),

losses:Number(losses),

goals,

points:Number(points)

});

});

if(table.length===0){

console.log("ERROR: Tabelle leer");
process.exit(1);

}

fs.writeFileSync(
"table.json",
JSON.stringify(table,null,2)
);

console.log("Teams:",table.length);

}

updateTable();
