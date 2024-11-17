import { Inject, Injectable } from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOathConfig from '../config/google-oath.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';



@Injectable()
export default class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(
        @Inject(googleOathConfig.KEY) private googleConfiguration:
        ConfigType<typeof googleOathConfig>,
        private readonly authService: AuthService
    ){
        super({
            clientID:googleConfiguration.clientID,
            clientSecret:googleConfiguration.clientSecret,
            callbackURL:googleConfiguration.callbackURL,
            scope:["email","profile"],
        })
    }

    async validate(accessToken:string, refreshToken:string, profile:any, done:VerifyCallback){
        const user = await this.authService.validateGoogleUser(
            {
                email:profile.emails[0].value,
                name:profile.name.givenName,
                lastname: profile.name.familyName,
                password:"",
                birthdate: new Date(),
                city:"San Luis",
                country:"Argentina",
                dni:"00000000",
                username:profile.emails[0].value.split('@')[0],
            })
        done(null,user)
    }
}