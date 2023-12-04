//jshint esversion:6
//!!!!!!!! because mongoose library has some method for encryption purpose, hence we use mongodb in this section
//!!!!!!!! instead of PostgreSQL

//step 1: install -- npm init -y
//step 2: install -- npm i express ejs body-parser

//Mongoose is an ODM (Object Data Modeling) library for MongoDB, meaning it acts as an 
                                   //intermediary between your Node.js application and the MongoDB database

//connecting to a MongoDB instance running on your local machine or on a specific 
                        //server within your local network.

// const port = 3000;
//"userDB" is our self-defined username for this DB. "useNewUrlParser: true": removes the warning in console

// app.set('view engine', 'ejs');//explicitly tells Express to use EJS (Embedded JavaScript) as the templating engine.

//~~~~~~~~ level 2 security -- mongoose encryption: https://www.npmjs.com/package/mongoose-encryption

//~~~~~~~~ 
//level 3 security -- use hash function. Utilize MD5. MD5 (Message Digest Algorithm 5) is a widely used
//cryptographic hash function that produces a 128-bit (16-byte) hash value. (although MD5 is not 
//recommended for cryptographic purposes due to vulnerabilities that have been discovered). 
//MD5 package is a JavaScript library that provides functionality to compute MD5 hashes. Any encrypted
//psw can't be decrypted back to the original psw. https://www.npmjs.com/package/md5
//~~~~~~~~

import express from "express";
import bodyParser from "body-parser";
                        
import mongoose from "mongoose";   
// import encrypt from 'mongoose-encryption'; //-- mongoose-encryption: level 2 encryption
// import md5 from "md5"; // -- level 3 encryption
import 'dotenv/config';
// console.log(process.env.API_KEY);
import bcryptjs from 'bcryptjs';// -- level 4 security



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// ... Your connection code
async function connectToDB() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/userDB");//if I use "localhost" instead of 127.0.0.1
                                      //for some reason, the program can't connect to mongodb
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      // Handle the error appropriately, maybe try reconnecting or terminate the app
    }
  }
  
  connectToDB(); // Call the function to establish the connection
  
  // ... Rest of your code with error handling for database operations
  

//######## create a mongo schema (aka. the DB structure) first
//######## this is level 1 security mongo schema, userSchema is simply a JS obj
/*const userSchema = {
    email: String,
    password: String
};*/

//######## this is level 2 security mongo schema, now userSchema is not just an JS obj, it is an obj from 
//######## mongoose class
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//######## https://www.npmjs.com/package/mongoose-encryption#secret-string-instead-of-two-keys
//         using a convenient way to encryption, it's called Secret String Instead of Two Keys
//######## however, this is still dangerous, because once project code is pushed to github, then everyone can search
//         this string. Hence, we can use sth. called environment variables, and there is a pkg in mkt called dotenv
//         can handle this. https://www.npmjs.com/package/dotenv
//         1st, require dotevn as early as possible in the project. 2nd, create a .env file by typing
//         "ni .env" in powershell.
/*
let secret = "Thisisourlittlesecret.";
*/

//add mongo encrypt as a plugin to our schema, and we will pass over our secret as JS obj
//we need to add this plugin to schema before creating our mongoose model cuz we are passing userSchema as a param
//to create our mongoose model
//but one drawback, the following code will encrypt the entire DB, hence it encrypt emails too, but it is not necessary
/*
userSchema.plugin(encrypt, { secret: secret });
*/
//######## hence, in order to only encrypt a certain area, we modify the above code:
//https://www.npmjs.com/package/mongoose-encryption#encrypt-only-certain-fields
/*
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']});
*/
//######## let's use environment variables
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']}); -- level 2 encryption


//use the schema we just created to set up a new user model
const User = new mongoose.model("User", userSchema);  //"User" is the name of our data collection
                                          //after this point, we can create users and add to userDB

//display a home page, use get
app.get ("/", (req, res)=>{
    res.render("home.ejs");
});

//display a register page
app.get ("/register", (req, res)=>{
    res.render("register.ejs");
});

//display a login page
app.get ("/login", (req, res)=>{
    res.render("login.ejs");
});


const salt = bcryptjs.genSaltSync(10); //level 4, add salt to each psw

//post the user input for email and password to /register endpoint
/*!!!!!!!! only after user input for email and registration has no problems, then render the secrets.ejs page!!!!!!!!*/
app.post("/register", (req, res)=>{
    bcryptjs.hash(req.body.password, salt, (err, hash)=>{ // -- level 4 security
        const newUser = new User({
            email: req.body.username,
            //password: req.body.password //--level 2 encryption
            // password: md5(req.body.password) //--level 3 encryption, using md5 hash
            password: hash //--level 4 security
        });
        //save this new user information
        //~~~~~~~~ level 2: in mongoose encryption, when we call save(), the psw field is automatically encrypted ~~~~~~~~*/
        newUser.save().then(()=>{
            res.render("secrets.ejs");
        }).catch((err)=>{
                console.log(err);
            });
        }) ;
});

//now, since user has registered email and psw, now they can submit their credentials to loging
app.post("/login", (req, res)=>{
    const email = req.body.username;
    // const psw = req.body.password; //--level 2 encryption
    // const psw = md5(req.body.password); //--level 3 encryption, using md5 hash
    const psw = req.body.password;//-- level 4 security: bcrypt
    //first, let's find the email from the "User" model that user submitted during registration stage
    //~~~~~~~~ level 2: in mongoose encryption, when we call findOne(), the psw field is automatically decrypted ~~~~~~~~*/
    User.findOne({email: email}).exec().then(foundUser=>{ //findOne() is a method provided by Mongoose, which is an Object Data Modeling (ODM) library for
                                // MongoDB when you're using it in a Node.js environment. It's not a 
                                //method native to JavaScript or MongoDB directly.
                                // is used to find a single document in a collection that matches the specified criteria. It allows you to query the database for documents based on certain conditions and retrieve the first document that matches those conditions.
        if (foundUser) {
            // if (foundUser.password === psw) { //-- level 2, 3 security: compare password 
            bcryptjs.compare(psw, foundUser.password, (err, result) => { //--level 4 security: compare the user input psw w. password stored in DB
                if (result === true){
                    res.render("secrets.ejs");
                }
            }); 
            }
        });
    });

    

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});




