import fs from "fs"
import path from "path"
import sharp from "sharp"

const inputDir = "./logos"
const outputDir = "./logos"

const files = fs.readdirSync(inputDir)

async function optimize(){

for(const file of files){

if(!file.endsWith(".png") && !file.endsWith(".jpg")) continue

const inputPath = path.join(inputDir,file)
const outputPath = path.join(outputDir,file)

try{

await sharp(inputPath)
.resize(40,40,{
fit:"contain",
background:{r:255,g:255,b:255,alpha:0}
})
.png({quality:80})
.toFile(outputPath + ".tmp")

fs.renameSync(outputPath + ".tmp",outputPath)

console.log("✔ optimiert:",file)

}catch(err){

console.log("⚠ Fehler bei:",file)

}

}

}

optimize()
