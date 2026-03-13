import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://www.kicker.de/regionalliga-west/tabelle";

async function scrape() {
  try {

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
      }
    });

    const $ = cheerio.load(data);

    const table = [];

    $(".kick__table tbody tr").each((i, el) => {

      const cells = $(el).find("td");

      if (cells.length > 8) {
        table.push({
          position: parseInt($(cells[0]).text().trim()),
          team: $(cells[1]).text().trim(),
          games: parseInt($(cells[2]).text().trim()),
          wins: parseInt($(cells[3]).text().trim()),
          draws: parseInt($(cells[4]).text().trim()),
          losses: parseInt($(cells[5]).text().trim()),
          goals: $(cells[6]).text().trim(),
          points: parseInt($(cells[8]).text().trim())
        });
      }

    });

    fs.writeFileSync("table.json", JSON.stringify(table, null, 2));

    console.log("table.json updated successfully");

  } catch (err) {

    console.error("Scraper error:", err);
    process.exit(1);

  }
}

scrape();
