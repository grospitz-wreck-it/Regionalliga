import fs from "fs"
import sharp from "sharp"

const folder = "./logos"

async function optimize(){

console.log("Starte Logo-Optimierung...")

const files = fs.readdirSync(folder)

for(const file of files){

if(!file.endsWith(".png") && !file.endsWith(".jpg")) continue

const input = `${folder}/${file}`

const output = `${folder}/opt-${file}`

try{

await sharp(input)
.resize(40,40,{fit:"contain"})
.png({compressionLevel:9})
.toFile(output)

console.log("✔ erstellt:",output)

}catch(err){

console.log("Fehler bei:",file)

}

}

}

optimize()
