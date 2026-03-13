import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url =
"https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW";

async function updateTable(){

const {data} = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

const $ = cheerio.load(data);

const table=[];

$("table.items tbody tr").each((i,el)=>{

const position=$(el).find("td").eq(0).text().trim();

const team=$(el).find(".hauptlink a").text().trim();

const logo=$(el).find("img").attr("src");

const games=$(el).find("td").eq(3).text().trim();

const wins=$(el).find("td").eq(4).text().trim();

const draws=$(el).find("td").eq(5).text().trim();

const losses=$(el).find("td").eq(6).text().trim();

const goals=$(el).find("td").eq(7).text().trim();

const points=$(el).find("td").eq(8).text().trim();

table.push({
position:Number(position),
team,
logo,
games:Number(games),
wins:Number(wins),
draws:Number(draws),
losses:Number(losses),
goals,
points:Number(points)
});

});

fs.writeFileSync("table.json",JSON.stringify(table,null,2));

console.log("Teams gefunden:",table.length);

}

updateTable();
