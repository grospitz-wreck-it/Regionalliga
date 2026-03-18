import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.fussball.de/ajax.table/-/staffel/02T93S3NHC000004VS5489BTVVQ0O654-G";

/* User Agents */

const userAgents = [
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/118 Safari/537.36"
];

function randomAgent(){
  return userAgents[Math.floor(Math.random()*userAgents.length)];
}

/* Logo Mapping */

function getLogo(team){
const name = team.toLowerCase()

if(name.includes("bocholt")) return "logos/bocholt.png"
if(name.includes("bochum")) return "logos/bochum.png"
if(name.includes("bonn")) return "logos/bonn.png"
if(name.includes("dortmund")) return "logos/dortmund.png"
if(name.includes("duesseldorf") || name.includes("düsseldorf")) return "logos/duesseldorf.png"
if(name.includes("köln ii") || name.includes("koln ii")) return "logos/fckoeln.png"
if(name.includes("fortuna köln") || name.includes("fortuna koln")) return "logos/fckoeln.png"
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

/* Fetch */

async function fetchPage(){
  const res = await axios.get(url,{
    headers:{
      "User-Agent": randomAgent()
    }
  })
  return res.data
}

/* Update */

async function updateTable(){

try{

const html = await fetchPage()
const $ = cheerio.load(html)

const table=[]

$("table tbody tr").each((i, row) => {

  const cols = $(row).find("td")
  if (cols.length < 8) return

  const team = $(row).find("a").first().text().trim()

  // 👉 Nur Zahlen extrahieren
  const numbers = cols.map((i, el) => $(el).text().trim())
    .get()
    .filter(v => /^[0-9]+$/.test(v))

  // 👉 Tore separat holen (enthält :)
  const goals = cols.map((i, el) => $(el).text().trim())
    .get()
    .find(v => v.includes(":"))

table.push({
  position: i + 1,
  team,
  logo: getLogo(team),

  games: Number(numbers[0]),
  wins: Number(numbers[1]),
  draws: Number(numbers[2]),
  losses: Number(numbers[3]),
  goals: goals,
  points: Number(numbers[numbers.length - 1]) // ✅ FIX
})
})
const output = {
  updated: new Date().toISOString(),
  matchday: Math.ceil(table[0]?.games / 1), // einfacher Spieltag (Spiele = Spieltag)
  table
}

fs.writeFileSync("table.json", JSON.stringify(output, null, 2))
fs.writeFileSync("table.json", JSON.stringify(table,null,2))

console.log("✔ Tabelle aktualisiert:", table.length)

}catch(err){
console.log("❌ Fehler:", err.message)
}

}

updateTable()
