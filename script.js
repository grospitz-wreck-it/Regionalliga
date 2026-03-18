async function loadTable() {
  try {
    const res = await fetch("table.json?cache=" + Date.now())
    const json = await res.json()

    // 👉 NEU: unterstützt alte + neue Struktur
    const data = json.table || json
    const updated = json.updated || null
    const matchday = json.matchday || null

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

    // 🔥 NEU: Meta setzen
    setMeta(updated, matchday)

    sendHeight()

  } catch (err) {
    console.error("Fehler beim Laden:", err)
  }
}

/* 🔥 Meta Anzeige */
function setMeta(updated, matchday) {
  const el = document.getElementById("meta")
  if (!el) return

  let text = ""

  if (matchday) {
    text += `Spieltag ${matchday}`
  }

  if (updated) {
    const date = new Date(updated)
    const formatted = date.toLocaleDateString("de-DE")

    if (text) text += " • "
    text += `Stand: ${formatted}`
  }

  el.textContent = text
}

/* 🔥 HEIGHT FIX */
function sendHeight() {
  const height = document.documentElement.scrollHeight
  window.parent.postMessage({ height }, "*")
}

/* 🔥 AUTO HEIGHT UPDATE */
const observer = new ResizeObserver(() => {
  sendHeight()
})

observer.observe(document.body)

loadTable()
