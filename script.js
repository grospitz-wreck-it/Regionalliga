async function loadTable() {
  try {
    const res = await fetch("table.json")
    const data = await res.json()

    const tbody = document.getElementById("table-body")
    tbody.innerHTML = ""

    data.forEach(team => {
      const row = document.createElement("tr")

      const pos = Number(team.position) || 0
      const total = data.length

      // Klassen setzen
      if (pos === 1) {
        row.classList.add("promoted")
      } else if (pos === 2) {
        row.classList.add("relegation")
      } else if (pos >= total - 2) {
        row.classList.add("relegated")
      }

      row.innerHTML = `
        <td>${pos}</td>
        <td class="team">
          <img src="${team.logo}" onerror="this.style.display='none'">
          ${team.team}
        </td>
        <td>${team.games ?? "-"}</td>
        <td>${team.wins ?? "-"}</td>
        <td>${team.draws ?? "-"}</td>
        <td>${team.losses ?? "-"}</td>
        <td>${team.goals ?? "-"}</td>
        <td>${team.points ?? "-"}</td>
      `

      tbody.appendChild(row)
    })

  } catch (err) {
    console.error("Fehler beim Laden:", err)
  }
}

loadTable()
