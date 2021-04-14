const { json } = require('express');
var express = require('express');
const session=require('express-session');
const cors=require("cors")

const dataService = require('./services/data.service')



var app = express();
app.use(cors({
   origin:'http://localhost:4200',
   credentials:true
}

))

app.use(session({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: false,
   
 }))
app.use(express.json());
// 
// const learnmiddileware=(req,res,next)=>{
//    console.log("hello  iam middle ware");
//    next();
// }

// app.use(learnmiddileware);

const authmiddileware=(req,res,next)=>{
   console.log("req.session.currentuser");
   console.log(req.session.currentuser)

   if(!req.session.currentuser){
      return res.json({
        status: false,
        statuscode:401,
        message:"please login"

      })
    }
    else{
       next();
    }
}

app.use((req, res, next)=>{
 console.log("A new request received at " )
 console.log(req.body)   
   next();
});


app.get('/', (req, res)=>{
   res.send("Hello !");
});

app.post('/post', (req, res)=>{
    res.send("You just called the post method at '/hello'!\n");
 });

 app.post('/register', (req, res)=>{
   
    console.log(req.body);

     dataService.register(req.body.acno,req.body.password,req.body.username)
   //  res.status(200).send("sucess")
   //  res.status(result.statuscode);
   // console.log( res.json(result))
   .then(result=>{
      res.status(result.statuscode).json(result)
   })

   
 });


 app.post('/login', (req, res)=>{
   
   //  console.log(req.body)

    dataService.login(req,req.body.acno,req.body.password)
    .then(result=>{
      res.status(result.statuscode).json(result);
      
    })
   
  
 });

 app.post('/deposit',authmiddileware, (req, res)=>{
   
   //  console.log(req.session.currentuser);
     dataService.deposit(req.body.acno,req.body.password,req.body.amount)
     .then(result=>{
    res.status(result.statuscode).json(result)
     })

   
 });
 app.post('/withdraw',authmiddileware, (req, res)=>{
   
   //  console.log(req.body);

     dataService.withdraw(req,req.body.acno,req.body.password,req.body.amount).then(result=>{
    res.status(result.statuscode).json(result)
     })

   
 });





app.patch('/', (req, res)=>{
    res.send("You just called the patch method at '/hello'!\n");
 });

app.listen(3000,()=>{
    console.log("server started at port 3000")
}); 