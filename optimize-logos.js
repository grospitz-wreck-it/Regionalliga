import fs from "fs"
import sharp from "sharp"

const folder = "./logos"

async function optimize(){

const files = fs.readdirSync(folder)

for(const file of files){

if(!file.endsWith(".png") && !file.endsWith(".jpg")) continue

const input = `${folder}/${file}`

const temp = `${folder}/temp-${file}`

await sharp(input)
.resize(40,40,{fit:"contain"})
.png({quality:80})
.toFile(temp)

fs.renameSync(temp,input)

console.log("✔ optimiert:",file)

}

}

optimize()
