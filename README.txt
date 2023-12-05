Add environment variables to level up level 2 security-------------------------------------
-------------------------------------------------------------------------------------------

https://www.npmjs.com/package/dotenv

1) npm i dotenv

2) import 'dotenv/config'

3) create a .env file in root directory

4) add my own environment variables to .env file I just created
How to do? In level 2, I created a string "Thisisourlittlesecret.", add this string to .env file following the required format --> NAME=VALUE





Level 4 security: bcrypt--------------------------------------------------------------------
--------------------------------------------------------------------------------------------
1) download npm bcrypt: https://www.npmjs.com/package/bcrypt
PS: I have hard time downloading brcypt, instead I do in terminal > npm i bcryptjs. It is a pure js implementation, only main difference is bcrypt is based on C++ but with strict rule of version compability. 
bcrypths is the optimized bcrypt in JavaScript with zero dependencies. https://www.npmjs.com/package/bcryptjs

2) each bcrypt version requires a match node version for security reason, in case I need to install an older version of bcrypt, in terminal > npm i bcrypt@3.0.2





using passport as authentication middleware in Node.js
1) install 4 packages, in terminal > npm i passport passport-local passport-local-mongoose express-session

2) configure (strict in order)
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose'; no need to explicitly import passport-local because passport-local is already a required dependency needed for passport-local-mongoose 

3) use express-session: 

app.use(session({
    secret: 'Our Little Secret.', //the secret string will be put into .env file later
    resave: false,
    saveUninitialized: false,
    
  }));

4) use passport: place the code after step 3) and before connection to mongoose

app.use(passport.initialize()); //initialize passport package
app.use(passport.session()); //tell passport to use session middleware

5) use passport-local-mongoose: place code after ""const User = new mongoose.model("User", userSchema);""                         

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

6) implement register, login, logout(end sessions), and keep user logged in (cookies)



