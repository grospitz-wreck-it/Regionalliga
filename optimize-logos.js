console.log("Starte Logo-Optimierung...")
import fs from "fs"
import sharp from "sharp"

const folder = "./logos"

async function optimize(){

const files = fs.readdirSync(folder)
console.log(files)
for(const file of files){

if(!file.endsWith(".png") && !file.endsWith(".jpg")) continue

const input = `${folder}/${file}`

try{

await sharp(input)
.resize({
width:40,
height:40,
fit:"inside"
})
.png({
compressionLevel:9,
quality:80
})
.toFile(`${input}.tmp`)

fs.renameSync(`${input}.tmp`,input)

console.log("✔ optimiert:",file)

}catch(err){

console.log("⚠ Fehler:",file)

}

}

}

optimize()
