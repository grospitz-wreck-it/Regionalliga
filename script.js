async function loadTable(){

const res = await fetch("table.json");
const data = await res.json();

const tbody = document.getElementById("table-body");

tbody.innerHTML="";

data.forEach((t,index)=>{

const row=document.createElement("tr");

/* Aufsteiger */

if(t.position===1){
row.classList.add("promoted");
}

/* Absteiger */

if(index>=data.length-3){
row.classList.add("relegated");
}

row.innerHTML=`
<td>${t.position}</td>

<td class="team">
<img src="${t.logo}" alt="">
<span>${t.team}</span>
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
