import { config } from './config';
import { getDecodedOAuthJwtGoogle } from './src/helper/function';

export const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy

passport.use(new GoogleStrategy({
    clientID:config?.CLIENT_ID,
    clientSecret:config?.CLIENT_SECRET,
    callbackURL:config?.CLIENT_HOST,
    passReqToCallback:true,
    session: false
},async function(request , accessToken,refreshToken , profile , done){
    return done(null, profile)
}))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null , id)
});

