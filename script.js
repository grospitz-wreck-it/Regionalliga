async function loadTable() {

  try {

    const res = await fetch("table.json")
    const data = await res.json()

    const tbody = document.getElementById("table-body")
    tbody.innerHTML = ""

    data.forEach((team, index) => {

      const row = document.createElement("tr")

      // =========================
      // STATUS LOGIK
      // =========================

      // 🟢 Platz 1 (Aufstieg)
      if (team.position === 1) {
        row.classList.add("promoted")
      }

      // 🟡 Platz 2 (Relegation)
      else if (team.position === 2) {
        row.classList.add("relegation")
      }

      // 🔴 letzte 3 (Abstieg)
      else if (team.position >= data.length - 2) {
        row.classList.add("relegated")
      }

      // =========================
      // FALLBACKS (wichtig!)
      // =========================

      const games = team.games ?? "-"
      const wins = team.wins ?? "-"
      const draws = team.draws ?? "-"
      const losses = team.losses ?? "-"
      const goals = team.goals ?? "-"
      const points = team.points ?? "-"

      // =========================
      // HTML
      // =========================

      row.innerHTML = `
        <td>${team.position}</td>

        <td class="team">
          <img src="${team.logo || ""}" 
               onerror="this.style.display='none'">
          ${team.team}
        </td>

        <td>${games}</td>
        <td>${wins}</td>
        <td>${draws}</td>
        <td>${losses}</td>
        <td>${goals}</td>
        <td>${points}</td>
      `

      tbody.appendChild(row)

    })

  } catch (err) {

    console.error("Fehler beim Laden der Tabelle:", err)

    document.getElementById("table-body").innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;padding:20px;">
          ⚠ Fehler beim Laden der Tabelle
        </td>
      </tr>
    `
  }

}

loadTable()
