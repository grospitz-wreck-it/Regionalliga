import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url =
"https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3/saison_id/2025";

/* Teamnamen normalisieren */

function normalize(name){

return name
.toLowerCase()
.replace(/ä/g,"ae")
.replace(/ö/g,"oe")
.replace(/ü/g,"ue")
.replace(/ß/g,"ss")
.replace(/[^a-z0-9]/g,"");
}

/* Logo automatisch finden */

function getLogo(team){

const key = normalize(team);

const files = fs.readdirSync("./logos");

for(const file of files){

if(key.includes(file.replace(".png",""))){
return "logos/"+file;
}

}

return "";
}

async function updateTable(){

const {data} = await axios.get(url,{
headers:{ "User-Agent":"Mozilla/5.0" }
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

const points=$(row).find("td").eq(9).text().trim();

table.push({
position:Number(position),
team,
logo:getLogo(team),
games:Number(games),
wins:Number(wins),
draws:Number(draws),
losses:Number(losses),
goals,
points:Number(points)
});

});

fs.writeFileSync("table.json",JSON.stringify(table,null,2));

console.log("Teams geladen:",table.length);

}

updateTable();
