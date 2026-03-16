import axios from "axios"
import cheerio from "cheerio"
import fs from "fs"

const URL = "https://www.transfermarkt.de/regionalliga-west/tabelle/wettbewerb/RLW3/saison_id/2025"

async function update(){

const {data} = await axios.get(URL,{
headers:{
"User-Agent":"Mozilla/5.0"
}
})

const $ = cheerio.load(data)

const table=[]

$(".items tbody tr").each((i,el)=>{

const team = $(el).find(".hauptlink a").text().trim()

const sp = $(el).find("td").eq(3).text().trim()
const s = $(el).find("td").eq(4).text().trim()
const u = $(el).find("td").eq(5).text().trim()
const n = $(el).find("td").eq(6).text().trim()
const t = $(el).find("td").eq(7).text().trim()
const p = $(el).find("td").eq(9).text().trim()

table.push({team,sp,s,u,n,t,p})

})

fs.writeFileSync("table.json",JSON.stringify(table,null,2))

console.log("Tabelle aktualisiert")

}

update()
