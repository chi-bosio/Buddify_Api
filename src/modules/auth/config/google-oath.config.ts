import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';
dotenv.config({path:'./.env.local'});

export default registerAs("googleOAuth",()=>({
    clientID: process.env.GOOGLE_CLIENTE_ID,
    clientSecret:process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}));