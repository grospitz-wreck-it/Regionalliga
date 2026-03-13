import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.kicker.de/regionalliga-west/tabelle";

async function scrape(){

const {data}=await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

const $=cheerio.load(data);

const table=[];

$(".kick__table tbody tr").each((i,row)=>{

const pos=$(row).find(".kick__data--rank").text().trim();
const team=$(row).find(".kick__data--team a").text().trim();

const cells=$(row).find("td");

if(!pos || !team) return;

table.push({

position:parseInt(pos),

team:team,

games:$(cells[3]).text().trim(),
wins:$(cells[4]).text().trim(),
draws:$(cells[5]).text().trim(),
losses:$(cells[6]).text().trim(),
goals:$(cells[7]).text().trim(),
points:$(cells[9]).text().trim()

});

});

fs.writeFileSync("table.json",JSON.stringify(table,null,2));

console.log("Regionalliga Tabelle aktualisiert:",table.length,"Teams");

}

scrape();
