import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.fussballdaten.de/regionalliga/west/";

async function scrape(){

try{

const res = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

const $ = cheerio.load(res.data);

const table = [];

$("table tbody tr").each((i,row)=>{

const cells=$(row).find("td");

if(cells.length < 8) return;

const position=$(cells[0]).text().trim();
const team=$(cells[1]).text().trim();

if(!position || !team) return;

table.push({

position:position,
team:team,
logo:"",
games:$(cells[2]).text().trim(),
wins:$(cells[3]).text().trim(),
draws:$(cells[4]).text().trim(),
losses:$(cells[5]).text().trim(),
goals:$(cells[6]).text().trim(),
points:$(cells[7]).text().trim()

});

});

fs.writeFileSync("table.json",JSON.stringify(table,null,2));

console.log("Teams gefunden:",table.length);

}catch(err){

console.error("Fehler:",err);

}

}

scrape();
