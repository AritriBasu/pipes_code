const express=require('express');
const app=express();
const path=require('path');
const bodyParser = require('body-parser');
const exphbs=require('express-handlebars');
const nodemailer = require('nodemailer');
//dotenv
require('dotenv').config();
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
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'roleplast1101@gmail.com',
      pass: 'roleplast9876'
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
  
  transporter.sendMail(mailOptions, function(error, info){
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

});

var port = process.env.PORT || 3000;
app.listen(port,function(){
  console.log('Server is running on http://localhost:' + port);
});
