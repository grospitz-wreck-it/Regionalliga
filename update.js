import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.kicker.de/regionalliga-west/tabelle";

async function scrape() {

const { data } = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

const $ = cheerio.load(data);

const table=[];

$("table tbody tr").each((i,row)=>{

const cells=$(row).find("td");

if(cells.length < 9) return;

const position=parseInt($(cells[0]).text().trim());

const team=$(cells[2]).text().trim();

const games=parseInt($(cells[3]).text().trim());

const wins=parseInt($(cells[4]).text().trim());

const draws=parseInt($(cells[5]).text().trim());

const losses=parseInt($(cells[6]).text().trim());

const goals=$(cells[7]).text().trim();

const points=parseInt($(cells[9]).text().trim());

if(position && team){

table.push({
position,
team,
games,
wins,
draws,
losses,
goals,
points
});

}

});

fs.writeFileSync("table.json",JSON.stringify(table,null,2));

console.log("Tabelle aktualisiert:",table.length,"Teams");

}

scrape();
