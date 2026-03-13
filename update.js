import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3";

async function updateTable() {

try {

const res = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0",
"Accept-Language":"de-DE,de;q=0.9"
}
});

const $ = cheerio.load(res.data);

const table = [];

$(".items tbody tr").each((i,row)=>{

const cells=$(row).find("td");

if(cells.length < 10) return;

const position=$(cells[0]).text().trim();
const team=$(cells[2]).text().trim();
const games=$(cells[3]).text().trim();
const wins=$(cells[4]).text().trim();
const draws=$(cells[5]).text().trim();
const losses=$(cells[6]).text().trim();
const goals=$(cells[7]).text().trim();
const points=$(cells[9]).text().trim();

const logo=$(row).find("img").attr("src");

table.push({
position,
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

fs.writeFileSync("table.json", JSON.stringify(table,null,2));

console.log("Teams gefunden:",table.length);

} catch(err) {

console.error(err);

}

}

updateTable();
