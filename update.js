import axios from "axios";
import fs from "fs";

const API_URL =
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

const {data}=await axios.get(API_URL,{
headers:{ "User-Agent":"Mozilla/5.0" }
});

/*
API liefert HTML-Fragmente
Wir extrahieren daraus die Spiele
*/

const matchRegex =
/data-home-team="([^"]+)".+?data-away-team="([^"]+)".+?data-result="([^"]+)"/g;

const matches=[];

let m;

while((m=matchRegex.exec(data))!==null){

const home=m[1];
const away=m[2];
const score=m[3];

if(!score.includes(":")) continue;

const [homeGoals,awayGoals]=score.split(":");

matches.push({
home,
away,
homeGoals:Number(homeGoals),
awayGoals:Number(awayGoals)
});

}

const teams={};

function init(team){

if(!teams[team]){

teams[team]={
team,
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

teams[m.home].goalsFor+=m.homeGoals;
teams[m.home].goalsAgainst+=m.awayGoals;

teams[m.away].goalsFor+=m.awayGoals;
teams[m.away].goalsAgainst+=m.homeGoals;

if(m.homeGoals>m.awayGoals){

teams[m.home].wins++;
teams[m.away].losses++;
teams[m.home].points+=3;

}

else if(m.homeGoals<m.awayGoals){

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

});

fs.writeFileSync(
"table.json",
JSON.stringify(table,null,2)
);

console.log("Teams:",table.length);

}

updateTable();
