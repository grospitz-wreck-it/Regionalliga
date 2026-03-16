import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const URL =
"https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3";

function normalize(text){
return text
.toLowerCase()
.replace(/ä/g,"ae")
.replace(/ö/g,"oe")
.replace(/ü/g,"ue")
.replace(/ß/g,"ss");
}

function logo(team){

const t = normalize(team);

if(t.includes("wuppertal")) return "logos/wuppertal.png";
if(t.includes("oberhausen")) return "logos/rwo.png";
if(t.includes("roedinghausen")) return "logos/roedinghausen.png";
if(t.includes("lotte")) return "logos/lotte.png";
if(t.includes("paderborn")) return "logos/paderborn.png";
if(t.includes("gladbach")) return "logos/gladbach.png";
if(t.includes("dortmund")) return "logos/dortmund.png";
if(t.includes("duesseldorf")) return "logos/f95.png";
if(t.includes("fortuna koeln")) return "logos/fortuna-koeln.png";
if(t.includes("koeln")) return "logos/fckoeln.png";
if(t.includes("guetersloh")) return "logos/guetersloh.png";
if(t.includes("wiedenbrueck")) return "logos/wiedenbrueck.png";
if(t.includes("velbert")) return "logos/velbert.png";
if(t.includes("schalke")) return "logos/schalke2.png";
if(t.includes("siegen")) return "logos/siegen.png";
if(t.includes("bonn")) return "logos/bonn.png";
if(t.includes("bochum")) return "logos/bochum.png";
if(t.includes("bocholt")) return "logos/bocholt.png";

return "logos/placeholder.png";
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

const cols=$(row).find("td");

if(cols.length<9) return;

const team=$(row).find(".hauptlink a").text().trim();

table.push({

position:Number($(cols[0]).text().trim()),
team,

logo:logo(team),

games:Number($(cols[3]).text().trim()),
wins:Number($(cols[4]).text().trim()),
draws:Number($(cols[5]).text().trim()),
losses:Number($(cols[6]).text().trim()),
goals:$(cols[7]).text().trim(),
points:Number($(cols[8]).text().trim())

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
