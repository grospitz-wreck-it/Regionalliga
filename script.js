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

      // 🟢 Aufstieg
      if (pos === 1) {
        row.classList.add("promoted")
      }

      // 🔴 Abstieg (letzte 4)
      else if (pos >= total - 3) {
        row.classList.add("relegated")
      }

      row.innerHTML = `
        <td>${pos}</td>
        <td class="team">
          <img src="${team.logo}" onerror="this.style.display='none'">
          <span>${team.team}</span>
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

    // 🔥 AFTER RENDER → Höhe initial senden
    sendHeight()

  } catch (err) {
    console.error("Fehler beim Laden:", err)
  }
}

/* 🔥 BESTER HEIGHT FIX */
function sendHeight() {
  const height = document.documentElement.scrollHeight
  window.parent.postMessage({ height }, "*")
}

/* 🔥 AUTO UPDATE bei Änderungen */
const observer = new ResizeObserver(() => {
  sendHeight()
})

observer.observe(document.body)

loadTable()
