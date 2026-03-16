import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url =
"https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3";

const logos = {
"SV Rödinghausen": "logos/sv-roedinghausen.png",
"FC Gütersloh": "logos/fc-guetersloh.png",
"Sportfreunde Lotte": "logos/sf-lotte.png",
"Fortuna Köln": "logos/fortuna-koeln.png",
"Rot-Weiß Oberhausen": "logos/rwo.png",
"1. FC Bocholt": "logos/bocholt.png",
"Fortuna Düsseldorf II": "logos/fortuna-duesseldorf-ii.png",
"SC Wiedenbrück": "logos/sc-wiedenbrueck.png",
"Wuppertaler SV": "logos/wuppertal.png",
"Alemannia Aachen II": "logos/aachen-ii.png",
"Schalke 04 II": "logos/schalke-ii.png",
"Düren": "logos/dueren.png",
"BVB II": "logos/dortmund-ii.png",
"Preußen Münster II": "logos/muenster-ii.png",
"KFC Uerdingen": "logos/kfc.png",
"RW Ahlen": "logos/rw-ahlen.png",
"SV Straelen": "logos/straelen.png",
"SSVg Velbert": "logos/velbert.png"
};

async function updateTable(){

const {data} = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
});

const $ = cheerio.load(data);

const table=[];

$("table.items tbody tr").each((i,row)=>{

const position = Number($(row).find("td").eq(0).text().trim());

const team = $(row).find(".hauptlink a").text().trim();

const games = Number($(row).find("td").eq(3).text().trim());

const wins = Number($(row).find("td").eq(4).text().trim());

const draws = Number($(row).find("td").eq(5).text().trim());

const losses = Number($(row).find("td").eq(6).text().trim());

const goals = $(row).find("td").eq(7).text().trim();

const points = wins * 3 + draws;

table.push({
position,
team,
logo: logos[team] || "",
games,
wins,
draws,
losses,
goals,
points
});

});

fs.writeFileSync("table.json",JSON.stringify(table,null,2));

console.log("Teams geladen:",table.length);

}

updateTable();
