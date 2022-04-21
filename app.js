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


app.get('/home', (req, res) => {
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

app.post('/logform', (req, res)=>{
  if(!req.body) return res.sendStatus(400);
  console.log(req.body);
  var userLogin = req.body.login;
  var userPassword = req.body.password;
  var isLoginCorrect = false;
  var isPasswordCorrect = false;

  for(let i = 0; i<registeredUsers.length; i++){
    if(userLogin === JSON.parse(registeredUsers[i]).login &&
     userPassword === JSON.parse(registeredUsers[i]).password){
      isLoginCorrect = true;
      isPasswordCorrect = true;
    }
    console.log(isLoginCorrect, isPasswordCorrect);
    if(isLoginCorrect === true && isPasswordCorrect === true){
      res.json({message: ''}).end();
    }else{
      res.json({message: '*Неверный логин или пароль'}).end();
    }
  }

})

app.post('/regform', (req, res)=>{
  if(!req.body) return res.sendStatus(400);
  console.log(req.body);
  var userLogin = req.body.mail;
  var userPassword = req.body.password
  var userPassword2 = req.body.password2
  var isPosibleReg = true;
  for(let i = 0; i<registeredUsers.length; i++){
    console.log(registeredUsers[i])
    if(userLogin === JSON.parse(registeredUsers[i]).login){
      isPosibleReg = false;
    }
  }
  if(userPassword === userPassword2 && isPosibleReg === true){
    var user = (`{"login":"${userLogin}",
    "password":"${userPassword}"}`);
    registeredUsers.push(user);
    fs.writeFileSync(__dirname+'/users.json', JSON.stringify(registeredUsers))
    res.json({message: ''}).end();
  } else if (userPassword !== userPassword2){
    res.json({error: true , message: '*Пароли не совпадают'}).end();
  } else if(isPosibleReg !== true){
    res.json({error: true , message: 'Пользователь уже существует'}).end();
  }
})

app.post("/order", (req, res) => {
  if(!req.body) return res.sendStatus(400);

  var data = fs.readFileSync(__dirname+'/order.json', 'utf8');
  orderedArr = JSON.parse(data);
  var isPosibleOrder = true;
  var uservk = req.body.vk;
  if(ordered < 26){
  var user = (`{"name":"${req.body.name}",
     "vk":"${req.body.vk}",
      "mail":"${req.body.mail}"}`);
    for(let i = 0; i < orderedArr.length; i++){
      if(JSON.parse(orderedArr[i]).vk === uservk){
        isPosibleOrder = false;
      }
    }
    if(isPosibleOrder){
        orderedArr.push(user);
        fs.writeFileSync(__dirname+'/order.json', JSON.stringify(orderedArr));
        ordered += 1;
        res.json({message: ''}).end();
      }else{
        res.json({error: true , message: '*Вы уже зарегестрировались'}).end();
      }
    }
  if (ordered > 3){
    res.json({error: true , message: '*Места кончились'}).end();
  }
  });

app.post('/signup', (req, res) => {
  if(req.body !== undefined ){
    res.send({message: 'we send SMS!'});
  }
} )


