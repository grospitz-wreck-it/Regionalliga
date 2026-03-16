import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const API =
"https://www.fussball.de/ajax.spielplan.page/-/mode/PAGE/staffel/02T93S3NHC000004VS5489BTVVQ0O654-G";

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

const {data}=await axios.get(API,{
headers:{ "User-Agent":"Mozilla/5.0" }
});

const $=cheerio.load(data);

const matches=[];

$(".match-row").each((i,row)=>{

const home=$(row).find(".home-team").text().trim();
const away=$(row).find(".away-team").text().trim();

const result=$(row).find(".result").text().trim();

if(!result.includes(":")) return;

const [hg,ag]=result.split(":");

matches.push({
home,
away,
hg:Number(hg),
ag:Number(ag)
});

});

const teams={};

function init(name){

if(!teams[name]){

teams[name]={
team:name,
games:0,
wins:0,
draws:0,
losses:0,
goalsFor:0,
goalsAgainst:0,
points:0
};

}

}

matches.forEach(m=>{

init(m.home);
init(m.away);

teams[m.home].games++;
teams[m.away].games++;

teams[m.home].goalsFor+=m.hg;
teams[m.home].goalsAgainst+=m.ag;

teams[m.away].goalsFor+=m.ag;
teams[m.away].goalsAgainst+=m.hg;

if(m.hg>m.ag){

teams[m.home].wins++;
teams[m.away].losses++;
teams[m.home].points+=3;

}

else if(m.hg<m.ag){

teams[m.away].wins++;
teams[m.home].losses++;
teams[m.away].points+=3;

}

else{

teams[m.home].draws++;
teams[m.away].draws++;

teams[m.home].points++;
teams[m.away].points++;

}

});

const table=Object.values(teams).sort((a,b)=>{

if(b.points!==a.points)
return b.points-a.points;

const diffA=a.goalsFor-a.goalsAgainst;
const diffB=b.goalsFor-b.goalsAgainst;

return diffB-diffA;

});

table.forEach((t,i)=>{

t.position=i+1;
t.logo=LOGO_BASE+findLogo(t.team);
t.goals=`${t.goalsFor}:${t.goalsAgainst}`;

delete t.goalsFor;
delete t.goalsAgainst;

});

if(table.length===0){

console.log("ERROR: Keine Spiele gefunden");
process.exit(1);

}

fs.writeFileSync(
"table.json",
JSON.stringify(table,null,2)
);

console.log("Teams:",table.length);

}

updateTable();
