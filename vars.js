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
        access: `https://graph.facebook.com/v22.0/${process.env.FB_USER_ID}/accounts?access_token=${process.env.FB_ACCESS_TOKEN}`,
        photos: 'https://graph.facebook.com/v22.0/613714781832221/photos'
    }
}

const paths = {
    images: path.join(__dirname, 'data','images'),
    texts: path.join(__dirname, 'data','texts.txt'),
    temp: path.join(__dirname, 'data','temp'),

}
export  {urls, paths}