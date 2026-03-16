async function loadTable() {

try {

const response = await fetch("./table.json");
const data = await response.json();

const tbody = document.getElementById("table-body");

if (!tbody) {
console.error("table-body nicht gefunden");
return;
}

tbody.innerHTML = "";

data.forEach(team => {

const row = document.createElement("tr");

row.innerHTML = `
<td>${team.position}</td>

<td class="team">
<img src="${team.logo}" alt="">
<span>${team.team}</span>
</td>

<td>${team.games}</td>
<td>${team.wins}</td>
<td>${team.draws}</td>
<td>${team.losses}</td>
<td>${team.goals}</td>
<td>${team.points}</td>
`;

tbody.appendChild(row);

});

} catch (error) {

console.error("Fehler beim Laden der Tabelle:", error);

}

}

document.addEventListener("DOMContentLoaded", loadTable);
