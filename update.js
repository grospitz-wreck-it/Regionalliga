import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url =
"https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3/saison_id/2025";

const LOGO_BASE =
"https://grospitz-wreck-it.github.io/Regionalliga/logos/";

/*
Teamname → Dateiname
*/
function normalizeTeamName(name){

return name
.toLowerCase()
.replace(/ä/g,"ae")
.replace(/ö/g,"oe")
.replace(/ü/g,"ue")
.replace(/ß/g,"ss")
.replace(/[^a-z0-9 ]/g,"")
.trim()
.replace(/\s+/g,"-");

}

/*
Logo bestimmen
*/
function getLogo(team){

const file=normalizeTeamName(team)+".png";

return LOGO_BASE+file;

}

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

const logo=getLogo(team);

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
