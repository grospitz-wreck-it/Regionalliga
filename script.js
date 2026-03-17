async function loadTable(){

const res = await fetch("table.json")
const data = await res.json()

const tbody = document.getElementById("table-body")
tbody.innerHTML = ""

data.forEach(team => {

const row = document.createElement("tr")

row.innerHTML = `
<td>${team.position}</td>
<td class="team">
  <img src="${team.logo}" onerror="this.style.display='none'">
  ${team.team}
</td>
<td>${team.games}</td>
<td>${team.wins}</td>
<td>${team.draws}</td>
<td>${team.losses}</td>
<td>${team.goals}</td>
<td>${team.points}</td>
`

tbody.appendChild(row)

})

}

loadTable()
