async function loadTable() {
  try {
    const res = await fetch("table.json")
    const data = await res.json()

    const tbody = document.getElementById("table-body")
    tbody.innerHTML = ""

    data.forEach(team => {
      const row = document.createElement("tr")

      // 🔢 sichere Werte
      const pos = Number(team.position) || 0
      const games = team.games ?? "-"
      const wins = team.wins ?? "-"
      const draws = team.draws ?? "-"
      const losses = team.losses ?? "-"
      const goals = team.goals ?? "-"
      const points = team.points ?? "-"

      // 🧠 Klassifizierung
      const total = data.length

      if (pos === 1) {
        row.classList.add("promoted")
      } else if (pos === 2) {
        row.classList.add("relegation")
      } else if (pos >= total - 2) {
        row.classList.add("relegated")
      }

      // 🧱 HTML
      row.innerHTML = `
        <td>${pos}</td>
        <td class="team">
          <img src="${team.logo}" onerror="this.style.display='none'">
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
  }
}

// 🚀 Start
loadTable()
