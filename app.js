//dotenv
require('dotenv').config();

const express=require('express');
const app=express();
const path=require('path');
const bodyParser = require('body-parser');
const exphbs=require('express-handlebars');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


//static folder
app.use('/public',express.static(path.join(__dirname,'public')));

//view engine setup
app.engine('handlebars',exphbs({
  defaultLayout:false,
}));
app.set('view engine','handlebars');
  
//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/',function(req,res){
  res.render('index');
});
 

//setting up oauth client
const oauth2Client = new OAuth2(
  "654178036658-3ou45h2i2fdh65481e3j15ehbl3mgbs6.apps.googleusercontent.com", // ClientID
  "gQD7LYymi-pev3xqXV46pt0U", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

//refresh and acess token
oauth2Client.setCredentials({
  refresh_token: "1//04lHiMVdIQWlkCgYIARAAGAQSNwF-L9IrPAhvNIlBkeelS721vIvBZI5RD8TV0ih11JxuMS6wZGzTP5kKGbmlrxN_BgWp-1uPilc"
});
const accessToken = oauth2Client.getAccessToken()

//to get form data
app.post('/submit-data', function (req, res) {
  const output=`
  <p>You have a new contact request</p>
  <h3>Contact details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    <li>Company: ${req.body.company}</li>
    <li>District: ${req.body.department}</li>
    <li>Product: ${req.body.doctor}</li>
  </ul>
    <h3>Requirement: <p>${req.body.message}</p></h3>
  `
  //nodemailer syntax

  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: "roleplast1101@gmail.com", 
         clientId: "654178036658-3ou45h2i2fdh65481e3j15ehbl3mgbs6.apps.googleusercontent.com",
         clientSecret: "gQD7LYymi-pev3xqXV46pt0U",
         refreshToken: "1//04lHiMVdIQWlkCgYIARAAGAQSNwF-L9IrPAhvNIlBkeelS721vIvBZI5RD8TV0ih11JxuMS6wZGzTP5kKGbmlrxN_BgWp-1uPilc",
         accessToken: accessToken
    },
    tls:{
      rejectUnauthorized:false
    }
});

  
  var mailOptions = {
    from: 'roleplast1101@gmail.com',
    to: 'basusub@gmail.com',
    subject: 'New customer Roleplast',
    html: output
  };
  
  smtpTransport.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      const errmsg="Your message could not be delivered. Please retry or contact us using the details below Hoping to hear from you soon!"
      res.render('index',{msg:errmsg});
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  const sentmsg="Your request has been submitted. We will get back to you shortly!";
  //after submission
  res.render('index',{msg:sentmsg});
  smtpTransport.close();
});

//adding port for heroku
var port = process.env.PORT || 3000;
app.listen(port,function(){
  console.log('Server is running on http://localhost:' + port);
});
