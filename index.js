import express from "express" 
import dotenv from 'dotenv'
dotenv.config()
import axios from "axios"
import { addDoc,collection, db, doc,setDoc,updateDoc,getDoc, arrayUnion, arrayRemove } from './firebase.js'

import * as queryString from 'query-string';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const sslRedirect = require('heroku-ssl-redirect').default

const ejs =require("ejs");
let cookieParser = require('cookie-parser');

var app = express();

const cors=require("cors");
var opn = require('opn');

app.use(cors())
app.use(cookieParser());
app.use(sslRedirect());

// { origin: 'http://127.0.0.1:3000/auth/google' }

app.use(express.static("public"));
app.set("view engine","ejs");

const { PORT=3000, LOCAL_ADDRESS='0.0.0.0' } = process.env


const stringifiedParams = queryString.stringify({
  client_id: process.env.CLIENT_ID,
  redirect_uri: 'https://calm-gorge-04227.herokuapp.com/loginDone',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '), // space seperated string
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
});

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;




async function getGoogleUserInfo(access_token) {
  const { data } = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  console.log(data); // { id, email, given_name, family_name }
  return data;
};

async function getAccessTokenFromCode(code) {
  const { data } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: 'https://calm-gorge-04227.herokuapp.com/loginDone',
      grant_type: 'authorization_code',
      code,
    },
  });
  console.log(data); // { access_token, expires_in, token_type, refresh_token }

  const userData= await getGoogleUserInfo(data.access_token);

  return userData;
};

async function save2firebase(data){

  const email = data.email;
  const name= data.name;
  const picture = data.picture;
  const docData = {
    email:email,
    name:name,
    photoURL: picture,
    score:[0],
  }

  const user = doc(db, "users", email);
  const docSnap = await getDoc(user);

  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return  docSnap.data()
  } else {
  // doc.data() will be undefined in this case
    setDoc(doc(db, "users", email),docData)
    return docData

  }
 
}



app.get("/",function(req,res){
  const user = req.cookies.userData;
  console.log(req.cookies.userData);
  if(user != undefined)
  {
      res.render("home",{name:user.given_name,score:[0]});

  }
  else
      res.render("home",{name:"-",score:[0]})
}); 



app.get('/getScore', async function(req, res) {
  // Successful authentication, redirect home.
 
  const userData = req.cookies.userData;
console.log(userData,"::")
  if(userData)
  {
  const user = doc(db, "users", userData.email);
  var scores=[]

  const docSnap = await getDoc(user);
  console.log("Document data:", docSnap.data());
  scores = docSnap.data().score
  res.send(scores);

  }
  else
  res.send({score: [0]});


})

app.get('/loginDone', async (req,res)=>{
    const urlParams = req.query;
    var data="aaaa"
    if (urlParams.error) {
      console.log(`An error occurred: ${urlParams.error}`);
    } else {
      console.log(`The code is: ${urlParams.code}`);
    }
    let options = {
      maxAge: 1000 * 60 * 60 * 24 * 2, // would expire after 15 minutes
      httpOnly: true, // The cookie only accessible by the web server
  }
   


  data = await getAccessTokenFromCode(urlParams.code);
  data = await   save2firebase(data);

  console.log(data)
  res.cookie("userData",data,options);
  res.redirect("/")
})

app.get("/updateScore/:val", async (req,res)=>{
  const userData = req.cookies.userData;

  if(userData)
  {
  const user = doc(db, "users", userData.email);
  var scores=[]
  const val=parseInt(req.params.val);
  console.log(val)

  // get data check score length 
  // if it is less than 10 then  

 
  const docSnap = await getDoc(user);
  console.log("Document data:", docSnap.data());
  scores = docSnap.data().score
  const len = scores.length;

  if( len < 10)
  {
    scores.push()
    console.log(scores)

  }
  else
  {
   (scores[len-1] > val ) ? console.log(scores,val) : scores[len-1]= val
   scores = scores.sort(function(a, b){return b-a});

  }
  
  await updateDoc(user, {
      score: scores

  });
  }
})

app.get("/clearCookie",(req,res)=>{

  console.log("hello");
  res.clearCookie("userData");
  res.redirect("/");

})


 app.get('/auth/google', (req,res)=>{
// opens the url in the default browser 

console.log(googleLoginUrl,"==")
})



app.get('/auth/google/callback',function(req, res) {
    // Successful authentication, redirect home.
    res.send("wrong redirect")
  });

app.listen(PORT, LOCAL_ADDRESS, function () {
  console.log('Example app listening on port 3000!');
});