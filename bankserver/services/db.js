const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/bank_server',{useNewUrlParser:true,useUnifiedTopology:true});

// schema
   const User=mongoose.model('User',{
    acno:Number,
    balance:Number,
    username:String,
    password:String
})

module.exports={
    User

}