import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3/saison_id/2025";

async function updateTable() {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    const table = [];

    // Tabelle mit Spalte "Platz" auswählen (sicherstellen, dass es die Ligatabelle ist)
    const tableRows = $("table.items").filter((i, el) => {
      return $(el).find("th").first().text().trim() === "Platz";
    }).find("tbody tr");

    tableRows.each((i, row) => {
      const position = $(row).find("td").eq(0).text().trim();
      if (!position) return; // leere Zeilen überspringen

      const team = $(row).find(".hauptlink a").text().trim();
      const logo = $(row).find("img").attr("src") || "";

      const games = Number($(row).find("td").eq(3).text().trim());
      const wins = Number($(row).find("td").eq(4).text().trim());
      const draws = Number($(row).find("td").eq(5).text().trim());
      const losses = Number($(row).find("td").eq(6).text().trim());

      // Tore parsen: "GF:GA"
      const goalsText = $(row).find("td").eq(7).text().trim();
      const [goalsFor, goalsAgainst] = goalsText.split(":").map(Number);

      const points = Number($(row).find("td").eq(8).text().trim());

      table.push({
        position: Number(position),
        team,
        logo,
        games,
        wins,
        draws,
        losses,
        goals: { for: goalsFor, against: goalsAgainst },
        points
      });
    });

    // JSON speichern
    fs.writeFileSync("table.json", JSON.stringify(table, null, 2));

    // Markdown für GitHub README
    const mdHeader = `| # | Team | Spiele | S | U | N | Tore | Punkte |\n|---|------|-------|---|---|---|------|--------|`;
    const mdRows = table.map(t => 
      `| ${t.position} | ${t.team} | ${t.games} | ${t.wins} | ${t.draws} | ${t.losses} | ${t.goals.for}:${t.goals.against} | ${t.points} |`
    ).join("\n");
    fs.writeFileSync("README.md", `${mdHeader}\n${mdRows}`);

    console.log(`Regionalliga West Teams: ${table.length}`);
  } catch (err) {
    console.error("Fehler beim Laden der Tabelle:", err.message);
  }
}

updateTable();
