const {Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db")




adminRouter.post("/signup" , function(req,res){
    res.json({
        message: "You're signed up"
    })
})

adminRouter.post("/signin" , function(req,res){
    res.json({
        message: "You're signed up"
    })
})

adminRouter.put("/createCourse" , function(req,res){
    res.json({
        message: "You're signed up"
    })
})

adminRouter.get("/course/bulk" , function(req,res){
    res.json({
        message: "You're signed up"
    })
})







module.exports = {
    adminRouter:adminRouter
}