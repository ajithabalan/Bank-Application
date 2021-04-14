const { request } = require("express");
const db=require("./db");
let accountDetails = {

    100: { acno: 100, balance: 1000, username: "userone", password: "testuser" },
    101: { acno: 101, balance: 12000, username: "usertwo", password: "testuser1" },
    103: { acno: 102, balance: 13000, username: "usethree", password: "testuser2" },
}

var currentuser;



const register=(acno,password,username)=>
{
// console.log("register called")
return db.User.findOne({acno}).then(user=>{
  console.log(user)
  if(user){
    return{
      status:false,
      statuscode:422,
      message:"user already exit please login"
  }

  }
  else{
    console.log("registering")
    const newUser=new db.User({
      acno,
        balance:0,
        username,
        password
    })
    newUser.save();
    return{
      status:true,
      statuscode:200,
      message:"reg successful"
    } 
  }

})

}

 const login=(req,accno,pwd)=>
  {
      var acno=parseInt(accno)
    // let dataset=accountDetails;
    return db.User.findOne({acno,password:pwd}).then(user=>{
      if(user){
        req.session.currentuser=user.acno;
        
        return {
            status:true,
            statuscode:200,
            message:"login success"  ,    
            name:user.username 
 
               }

      }else{
        return { 
          status:false,
          statuscode:422,
          message:"username/password not correct",
         
        }
      }
      
    })
     
  //    if(accno in dataset)
  //    {
  //       var pwd1=dataset[accno].password;
  //       if(pwd==pwd1)
  //       {
  //        req.session.currentuser=accountDetails[accno].username;
        
  //       return {
  //           status:true,
  //           statuscode:200,
  //           message:"login success"       
 
  //              }
  //       }
  //    else
  //    {
   
  //  return { 
  //           status:false,
  //           statuscode:422,
  //           message:"username/password not correct"
  //         }
  //     } 
  //   }
        
  
  // else 
  //        {
    
  //   return {
  //       status:false,
  //       statuscode:422,
  //       message:"user dosent exist"
  //          }
     
  //        }
         }

 const deposit=(accnum,passWrd,amount)=>
  {
    // if(!req.session.currentuser){
    //   return{
    //     status: false,
    // statuscode:401,
    // message:"please login"

    //   }
    // }
    var acno=accnum;
    var amt=parseInt(amount)
    // otherwise treated as string
    // let dataset=accountDetails;
    //  console.log(dataset)
    //  console.log(accnum)
    return db.User.findOne({acno,password:passWrd}).then(user=>{

      if(!user){
        return{
          status: false,
          statuscode:422,
          message:"deposit unsuccessfull ,wrong accnum/password"
          
              }

      }
      
        user.balance+=amt;
        user.save();

        return{
          status:true,
             statuscode:200,
             message:"amount is credited",
             balance:user.balance

        }
      
    })
      




//      if(accnum in dataset)
//      {
//         var password=dataset[accnum].password;
//         if(passWrd==password)
//         {
//           accountDetails[accnum].balance+=amt;
        
//         return{
//              status:true,
//              statuscode:200,
//              message:"amount is credited",
//              balance:accountDetails[accnum].balance
//         }
        
 
//         }
//      else{
//    return{
       
//     status: false,
//     statuscode:422,
//     message:"deposit unsuccessfull ,wrong accnum/password"
//          }
        
//   }}
//   else{
//       return{
//     message:"user dosent exist",
//     statuscode:422,
//     status:false
//   }
// }
  }

  const withdraw=(accnum,passWrd,amount)=>
  {
    
    var amt=parseInt(amount)
    // otherwise treated as string
    
    // let dataset=accountDetails;
    //  console.log(dataset)
    //  console.log(accnum)
    return db.User.findOne({acno:accnum,password:passWrd}).then(user=>{

      if(!user){
        return{
          status: false,
          statuscode:422,
          message:"deposit unsuccessfull ,wrong accnum/password"
          
              }

      }
      if(req.currentuser.accno!=accnum){
        return{
          message:"permission denied",
          statuscode:422,
          status:false
          }

      }

      if(user.balance<amt)
      {
        return{
          message:"low balance",
          statuscode:422,
          status:false
          }

      }
      
        user.balance-=amt;
        user.save();

        return{
          status:true,
             statuscode:200,
             message:"amount is debited",
             balance:user.balance

        }
      
    })



    
  }

  module.exports={
      register,login,deposit,withdraw
  }