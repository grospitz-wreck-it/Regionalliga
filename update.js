import axios from "axios";
import fs from "fs";

const url = "https://api.openligadb.de/getbltable/regionalliga-west/2024";

async function update(){

try{

const res = await axios.get(url);

const table=res.data.map(team=>({

position:team.rank,
team:team.teamName,
logo:team.teamIconUrl,
games:team.matches,
wins:team.won,
draws:team.draw,
losses:team.lost,
goals:team.goals + ":" + team.opponentGoals,
points:team.points

}));

fs.writeFileSync("table.json",JSON.stringify(table,null,2));

console.log("Tabelle aktualisiert");

}catch(err){

console.error(err);

}

}

update();
