import dotenv from "dotenv";
import {config} from "./config.js";
import botEngine from "./botEngine.js";
import * as readline from "node:readline/promises";
import {urls} from "./vars.js";
import axios from "axios";
dotenv.config();

const runBot = (access_token, page_id, user_id) => {
    botEngine(access_token, page_id, user_id);
    setInterval(()=>{
        botEngine(access_token, page_id, user_id)
    },config.timer_interval*1000*60*60)
}

let ACCESS_TOKEN;
let USER_ID;
let PAGE_ID;

/*  user token stream stdIn  */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const init = async ()=>{
    ACCESS_TOKEN = await rl.question('enter access token: \r\n')
    USER_ID = await rl.question('enter use ID: \r\n')
    PAGE_ID = await rl.question('enter page ID \r\n')
    rl.close()
}
await init();
console.log(`entered tokens: \r\n access_token: ${ACCESS_TOKEN} \r\n user_id: ${USER_ID} \r\n ${PAGE_ID}`);

/*   get longlife access_token   */
const url = `${urls.facebook.longToken}${ACCESS_TOKEN}`
const res = await axios.get(url)
ACCESS_TOKEN = res.data.access_token
console.log('obtained long-life token: ', ACCESS_TOKEN)

if (config.delay!==0) setTimeout(() => {
    runBot(ACCESS_TOKEN, PAGE_ID, USER_ID)
}, config.delay * 60  * 1000)
else {
    console.log('starting engine with no delay')
    runBot(ACCESS_TOKEN, PAGE_ID, USER_ID)
}
