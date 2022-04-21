const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');

const {getRequests, postRequests} = require('./route.js');
const { send } = require('express/lib/response');


const app = express()
const port = 3000

var ordered = 0;
var orderedArr = [];
var registeredUsers = [];

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})

app.use(express.static('static'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



app.get('/', (req, res) => {
  res.type('html')
  res.sendFile(__dirname + '/static/index.html')
});


app.get('/index.html', (req, res) => {
  res.type('html')
  res.sendFile(__dirname + '/static/index.html')
})

app.get('/log', (req, res) => {
  var data = fs.readFileSync(__dirname+'/users.json', 'utf8');
  registeredUsers = JSON.parse(data);
  res.type('html')
  res.sendFile(__dirname + '/static/log.html')
})

app.get('/reg', (req, res) => {
  var data = fs.readFileSync(__dirname+'/users.json', 'utf8');
  registeredUsers = JSON.parse(data);
  res.type('html')
  res.sendFile(__dirname + '/static/reg.html')
})

app.post('/log', (req, res)=>{
  if(!req.body) return res.sendStatus(400);
  console.log(req.body);
  var userLogin = req.body.login;
})

app.post('/reg', (req, res)=>{
  if(!req.body) return res.sendStatus(400);
  console.log(req.body);
  var userLogin = req.body.mail;
  var userPassword = req.body.password
  var userPassword2 = req.body.password2
  var isPosibleReg = true;
  for(let i = 0; i<registeredUsers.length; i++){
    if(userLogin === JSON.parse(registeredUsers[i]).login){
      var isPosibleReg = false;
    }
  }
  if(userPassword === userPassword2 && isPosibleReg === true){
    var user = (`{"login":"${userLogin}",
    "password":"${userPassword}"}`);
    registeredUsers.push(user);
    fs.writeFileSync(__dirname+'/users.json', JSON.stringify(registeredUsers))
    res.redirect('/course.html');
  } else if (userPassword !== userPassword2){
    res.sendFile(__dirname+'/exceptions/regpass.html')
  } else if(isPosibleReg !== true){
    res.sendFile(__dirname+'/exceptions/reglog.html')
  }
})

app.post("/", (req, res) => {
  if(!req.body) return res.sendStatus(400);
  if(ordered < 26){
  var user = (`{"name":"${req.body.name}",
     "vk":"${req.body.vk}",
      "mail":"${req.body.mail}"},`);
  orderedArr.push(user);
  fs.writeFileSync(__dirname+'/order.json', JSON.stringify(orderedArr));
  fs.closeSync(0)
  ordered += 1;
  }
  if (ordered > 3){
    //if(req.body !== undefined ){
      //res.send(alert('dfdws'));
    //}
  }
  });

app.post('/signup', (req, res) => {
  if(req.body !== undefined ){
    res.send({message: 'we send SMS!'});
  }
} )


