import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3/saison_id/2025";

/*
Mapping: Teamname -> Logo-Datei
Die Dateien müssen im Repo liegen:
Regionalliga/logos/
*/
const logos = {
  "Fortuna Köln": "fortuna-koeln.png",
  "RW Oberhausen": "rwo.png",
  "Wuppertaler SV": "wuppertal.png",
  "Sportfreunde Lotte": "lotte.png",
  "Borussia Mönchengladbach II": "gladbach.png",
  "SC Paderborn II": "paderborn.png",
  "SV Rödinghausen": "roedinghausen.png",
  "1. FC Bocholt": "bocholt.png",
  "Fortuna Düsseldorf II": "f95.png",
  "FC Gütersloh": "guetersloh.png",
  "Bonner SC": "bonn.png",
  "Borussia Dortmund II": "dortmund.png",
  "SSVg Velbert": "velbert.png",
  "SV Wiedenbrück": "wiedenbrueck.png",
  "FC Schalke 04 II": "schalke2.png",
  "Sportfreunde Siegen": "siegen.png"
};

async function updateTable() {

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const $ = cheerio.load(data);

  const table = [];

  $("table.items tbody tr").each((i, row) => {

    const position = $(row).find("td").eq(0).text().trim();
    if (!position) return;

    const team = $(row).find(".hauptlink a").text().trim();

    const logoFile = logos[team] || "default.png";

    const logo =
      `https://grospitz-wreck-it.github.io/Regionalliga/logos/${logoFile}`;

    const games = $(row).find("td").eq(3).text().trim();
    const wins = $(row).find("td").eq(4).text().trim();
    const draws = $(row).find("td").eq(5).text().trim();
    const losses = $(row).find("td").eq(6).text().trim();
    const goals = $(row).find("td").eq(7).text().trim();
    const points = $(row).find("td").eq(8).text().trim();

    table.push({
      position: Number(position),
      team,
      logo,
      games: Number(games),
      wins: Number(wins),
      draws: Number(draws),
      losses: Number(losses),
      goals,
      points: Number(points)
    });

  });

  fs.writeFileSync(
    "table.json",
    JSON.stringify(table, null, 2)
  );

  console.log("Regionalliga West Teams:", table.length);

}

updateTable();
