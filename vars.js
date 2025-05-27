import * as path from 'path'
import {fileURLToPath} from 'url'
import dotenv from 'dotenv'
dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const urls = {
    imgKit: {
        post: 'https://upload.imagekit.io/api/v1/files/upload',
        get:'https://api.imagekit.io/v1/files'
    },
    facebook:{
        access: (id)=>{return `https://graph.facebook.com/v22.0/${id}/accounts?access_token=`},
        photos: (pageId)=>{return `https://graph.facebook.com/v22.0/${pageId}/photos`},
        longToken:`https://graph.facebook.com/v22.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FB_APP_ID}&client_secret=${process.env.FB_APP_SECRET}&fb_exchange_token=`
    }
}

const paths = {
    images: path.join(__dirname, 'data','images'),
    texts: path.join(__dirname, 'data','texts.txt'),
    temp: path.join(__dirname, 'data','temp'),

}
export  {urls, paths}