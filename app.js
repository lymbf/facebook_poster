import dotenv from "dotenv";
import {config} from "./config.js";
import botEngine from "./botEngine.js";
dotenv.config();

const run = true

const runBot = () => {
    botEngine();
    setInterval(()=>{
        botEngine()
    },config.timer_interval*1000*60*60)
}

if (config.delay!==0) setTimeout(() => {
    runBot()

}, config.delay * 60  * 1000)
else {
    console.log('starting engine with no delay')
    runBot()
}
