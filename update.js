import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url =
"https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3/saison_id/2025";

/* verschiedene Browser simulieren */

const userAgents = [
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/118 Safari/537.36"
]

function randomAgent(){
return userAgents[Math.floor(Math.random()*userAgents.length)]
}

/* Logo-Erkennung */

function getLogo(team){

const name = team.toLowerCase()

if(name.includes("bocholt")) return "logos/bocholt.png"
if(name.includes("bochum")) return "logos/bochum.png"
if(name.includes("bonn")) return "logos/bonn.png"
if(name.includes("dortmund")) return "logos/dortmund.png"
if(name.includes("duesseldorf") || name.includes("düsseldorf")) return "logos/duesseldorf.png"
if(name.includes("köln ii") || name.includes("koln ii")) return "logos/fckoeln.png"
if(name.includes("fortuna köln") || name.includes("fortuna koln")) return "logos/fortuna-koeln.png"
if(name.includes("gladbach")) return "logos/gladbach.png"
if(name.includes("gütersloh") || name.includes("guetersloh")) return "logos/guetersloh.png"
if(name.includes("lotte")) return "logos/lotte.png"
if(name.includes("paderborn")) return "logos/paderborn.png"
if(name.includes("rödinghausen") || name.includes("roedinghausen")) return "logos/roedinghausen.png"
if(name.includes("oberhausen")) return "logos/rwo.png"
if(name.includes("schalke")) return "logos/schalke2.png"
if(name.includes("siegen")) return "logos/siegen.png"
if(name.includes("velbert")) return "logos/velbert.png"
if(name.includes("wiedenbrück") || name.includes("wiedenbrueck")) return "logos/wiedenbrueck.png"
if(name.includes("wuppertal")) return "logos/wuppertal.png"

console.log("⚠ Kein Logo gefunden:",team)

return ""
}

/* Request mit Retry */

async function fetchPage(retries=3){

for(let i=0;i<retries;i++){

try{

const res = await axios.get(url,{
timeout:15000,
headers:{
"User-Agent":randomAgent(),
"Accept":"text/html,application/xhtml+xml",
"Accept-Language":"de-DE,de;q=0.9",
"Referer":"https://www.transfermarkt.de/"
}
})

return res.data

}catch(err){

console.log("⚠ Request fehlgeschlagen, Versuch",i+1)

if(i===retries-1){
throw err
}

await new Promise(r=>setTimeout(r,4000))

}

}

}

async function updateTable(){

try{

const html = await fetchPage()

const $ = cheerio.load(html)

const table=[]

$("table.items tbody tr").each((i,row)=>{

const position=$(row).find("td").eq(0).text().trim()

const team=$(row).find(".hauptlink a").text().trim()

const games=$(row).find("td").eq(3).text().trim()

const wins=$(row).find("td").eq(4).text().trim()

const draws=$(row).find("td").eq(5).text().trim()

const losses=$(row).find("td").eq(6).text().trim()

const goals=$(row).find("td").eq(7).text().trim()

const points=$(row).find("td").eq(9).text().trim()

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

})

})

fs.writeFileSync("table.json",JSON.stringify(table,null,2))

console.log("✔ Tabelle aktualisiert:",table.length,"Teams")

}catch(err){

console.log("❌ Scraper Fehler:",err.message)

}

}

updateTable()
