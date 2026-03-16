import axios from "axios";
import fs from "fs";

const API =
"https://www.fussball.de/ajax.tabelle/-/staffel/02T93S3NHC000004VS5489BTVVQ0O654-G";

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

  return "tmp";
}

async function updateTable(){

  const response = await axios.get(API,{
    headers:{
      "User-Agent":"Mozilla/5.0",
      "Accept":"application/json, text/javascript, */*; q=0.01",
      "X-Requested-With":"XMLHttpRequest"
    }
  });

  const data=response.data;

  if(!data || !data.rows){

    console.log("API Antwort:",data);
    console.log("ERROR: Tabelle nicht gefunden");
    process.exit(1);

  }

  const table=[];

  data.rows.forEach((team,i)=>{

    table.push({
      position:i+1,
      team:team.teamName,
      logo:LOGO_BASE+findLogo(team.teamName),
      games:team.matches,
      wins:team.wins,
      draws:team.draws,
      losses:team.losses,
      goals:`${team.goalsFor}:${team.goalsAgainst}`,
      points:team.points
    });

  });

  fs.writeFileSync(
    "table.json",
    JSON.stringify(table,null,2)
  );

  console.log("Teams:",table.length);

}

updateTable();
