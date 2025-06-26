const {Router } = require("express");
const userRouter = Router();
const { userModel } = require("../db");




userRouter.post("/signup" , function(req,res){
    const {email , password, firstName, lastName} = req.body;
    //this can be done by const email = req.body.email and so on , we're just destructured the element  

    res.json({
        message: "You're signed up"
    })
})



userRouter.post("/signin" , function(req,res){
    res.json({
        message: "You're signed up"
    })
})




userRouter.get("/purchases" , function(req,res){
    res.json({
        message: "You're purchases course"
    })
})


module.exports = {
    userRouter:userRouter
}