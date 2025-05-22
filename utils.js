import {config} from "./config.js";
import {paths} from "./vars.js";
import * as fs from "node:fs";
import * as path from "node:path";
const temp = JSON.parse(fs.readFileSync(path.join(paths.temp, 'tempVars.json')).toString())

const randomNumber = ({min, max})=>{
    return Math.floor(Math.random() * (max - min||0)) + min||0;
}

export {randomNumber}