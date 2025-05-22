import * as fs from "node:fs";
import * as path from "node:path";
import {paths, urls} from "./vars.js";
import * as fsPromises from "node:fs/promises";
import {randomNumber} from "./utils.js";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

export default async function botEngine(){

    /*   1. get list of images  ->   check if temp/images is empty  */

    const imgs = fs.readdirSync(paths.images)
    if(!imgs.length){
        console.log('folder with images is empty, or youve used them all, exiting..')
        process.exit()
    }

    /*   2. if so -> copy imgs into temp -> draw img */

    const CHOSEN_IMG = imgs[randomNumber({min:0, max:imgs.length-1})]
    console.log('chosen image: ', CHOSEN_IMG)

    /*   3. get image URL  ->  post request into imgKIT  ->  URL is in the response */

    const IMGKIT_AUTH = Buffer.from(`${process.env.IMGKIT_PRIVATE_KEY}:${process.env.IMGKIT_PASSWORD}`).toString('base64')
    const imgKitForm = new FormData()
    const file = fs.readFileSync(path.join(paths.images, CHOSEN_IMG))
    let imgUrl;

    imgKitForm.set('file', file.toString('base64'))
    imgKitForm.set('fileName', CHOSEN_IMG)

    try{
        const res = await axios.post(urls.imgKit.post,
            imgKitForm,
            {headers:{
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Basic ${IMGKIT_AUTH}`,
                }})
        imgUrl = res.data.url
        console.log('posted image to imgKit successful')
        console.log('obtained url: ', res.data.url)
    }catch(err){
        console.log('sth went wrong, error: ', err.message)
        process.exit();
    }

    /*   4. remove drawn image from tmp   */

    await fsPromises.rm(path.join(paths.images, CHOSEN_IMG))

    /*   5. check if  texts exists  and is not empty */
    if(!fs.existsSync(paths.texts) || fs.readFileSync(paths.texts).length === 0){
        console.log('text file doesnt exist or youve used all unique tests, exiting..')
        process.exit();
    }

    /*   6. get list of texts -> draw 1 -> remove from texts */
    const texts = fs.readFileSync(paths.texts).toString().split('\r\n');
    const i = randomNumber({min:0, max:texts.length-1})
    const CHOSEN_TEXT = texts[i]

    console.log('drawned text: ', CHOSEN_TEXT);
    texts.splice(i, 1)
    fs.writeFileSync(paths.texts, texts.join('\r\n'))

    /*   7. verify access token -> get page access token  */

    let page_token;
    try{
        const fbRes = await axios.get(urls.facebook.access)
        page_token = fbRes.data.data.filter(el=>{return el.id === process.env.FB_PAGE_ID})[0]?.access_token
        if(!page_token){
            console.log('facebook page not found, exiting..')
            process.exit();
        }
    }catch(error){
        console.log('sth went wrong while posting to facebook, exiting..')
        process.exit();
    }
    console.log('page token obtained, proceeding to post to facebook')

    /*   8. post into facebook   */

    try{
        const res = await axios.post(`${urls.facebook.photos}?access_token=${page_token}`, {
            url: imgUrl,
            caption:CHOSEN_TEXT
        },{
            headers:{
                'Content-Type': 'application/json',
            }
        })
        console.log('res: ', res.data)
    }catch(err){
        console.log('error: ', err.data)
    }

    /*   9. on success make delete request into imgKIT*/

    //unsupported by imgKit API
}

// botEngine()