import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url =
"https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3/saison_id/2025";

/* Logo Mapping basierend auf deinen Dateien */

const logos = {

"1.FC Bocholt":"logos/bocholt.png",
"VfL Bochum II":"logos/bochum.png",
"Bonner SC":"logos/bonn.png",
"B. Dortmund II":"logos/dortmund.png",
"Düsseldorf II":"logos/duesseldorf.png",
"1.FC Köln II":"logos/fortuna-koeln.png",
"Fortuna Köln":"logos/fortuna-koeln.png",
"M'gladbach II":"logos/gladbach.png",
"FC Gütersloh":"logos/guetersloh.png",
"SF Lotte":"logos/lotte.png",
"SC Paderborn II":"logos/paderborn.png",
"SV Rödinghausen":"logos/roedinghausen.png",
"RW Oberhausen":"logos/rwo.png",
"Schalke 04 II":"logos/schalke2.png",
"Sprf. Siegen":"logos/siegen.png",
"Spfr. Siegen":"logos/siegen.png",
"Sportfreunde Siegen":"logos/siegen.png",
"SSVg Velbert 02":"logos/velbert.png",
"SC Wiedenbrück":"logos/wiedenbrueck.png",
"Wuppertaler SV":"logos/wuppertal.png"

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
logo:logos[team] || "",
games:Number(games),
wins:Number(wins),
draws:Number(draws),
losses:Number(losses),
goals,
points:Number(points)

});

});

fs.writeFileSync("table.json",JSON.stringify(table,null,2));

console.log("Regionalliga West Teams:",table.length);

}

updateTable();
