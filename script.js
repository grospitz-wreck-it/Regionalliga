async function loadTable(){

const res=await fetch("table.json");
const data=await res.json();

const tbody=document.getElementById("table-body");

data.forEach(t=>{

const row=document.createElement("tr");

row.innerHTML=`
<td>${t.position}</td>
<td class="team">
<img src="${t.logo}">
${t.team}
</td>
<td>${t.games}</td>
<td>${t.wins}</td>
<td>${t.draws}</td>
<td>${t.losses}</td>
<td>${t.goals}</td>
<td>${t.points}</td>
`;

tbody.appendChild(row);

});

}

loadTable();
