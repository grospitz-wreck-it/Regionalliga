import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const URL =
"https://www.fussball.de/spieltagsuebersicht/regionalliga-west-region-westdeutschland-regionalliga-herren-saison2526-region-westdeutschland/-/staffel/02T93S3NHC000004VS5489BTVVQ0O654-G";

const LOGO_BASE =
"https://grospitz-wreck-it.github.io/Regionalliga/logos/";

function normalize(text){
  return text
  .toLowerCase()
  .replace(/ä/g,"ae")
  .replace(/ö/g,"oe")
  .replace(/ü/g,"ue")
  .replace(/ß/g,"ss");
}

function findLogo(team){

  const t=normalize(team);

  if(t.includes("wuppertal")) return "wuppertal.png";
  if(t.includes("oberhausen")) return "rwo.png";
  if(t.includes("roedinghausen")) return "roedinghausen.png";
  if(t.includes("lotte")) return "lotte.png";
  if(t.includes("paderborn")) return "paderborn.png";
  if(t.includes("gladbach")) return "gladbach.png";
  if(t.includes("dortmund")) return "dortmund.png";
  if(t.includes("duesseldorf")) return "f95.png";
  if(t.includes("koeln")) return "fckoeln.png";
  if(t.includes("fortuna koeln")) return "fortuna-koeln.png";
  if(t.includes("guetersloh")) return "guetersloh.png";
  if(t.includes("wiedenbrueck")) return "wiedenbrueck.png";
  if(t.includes("velbert")) return "velbert.png";
  if(t.includes("schalke")) return "schalke2.png";
  if(t.includes("siegen")) return "siegen.png";
  if(t.includes("bonn")) return "bonn.png";
  if(t.includes("bochum")) return "bochum.png";
  if(t.includes("bocholt")) return "bocholt.png";

  return "placeholder.png";
}

async function updateTable(){

  const {data} = await axios.get(URL,{
    headers:{
      "User-Agent":"Mozilla/5.0"
    }
  });

  const $ = cheerio.load(data);

  const table=[];

  $(".table tbody tr").each((i,row)=>{

    const cols=$(row).find("td");

    if(cols.length<8) return;

    const team=$(cols[1]).text().trim();

    table.push({
      position:Number($(cols[0]).text().trim()),
      team,
      logo:LOGO_BASE+findLogo(team),
      games:Number($(cols[2]).text().trim()),
      wins:Number($(cols[3]).text().trim()),
      draws:Number($(cols[4]).text().trim()),
      losses:Number($(cols[5]).text().trim()),
      goals:$(cols[6]).text().trim(),
      points:Number($(cols[7]).text().trim())
    });

  });

  if(table.length===0){
    console.log("ERROR: Tabelle nicht gefunden");
    process.exit(1);
  }

  fs.writeFileSync(
    "table.json",
    JSON.stringify(table,null,2)
  );

  console.log("Teams:",table.length);

}

updateTable();
