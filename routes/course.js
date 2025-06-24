const {Router} = require("express");
const courseRouter = Router();

courseRouter.post("/purchase" , function(res, req){

    res.json({
        message: "ur purchases"
    })
})


courseRouter.get("/preview" , function(req,res){

    res.json({
        message: " courses"
    })
})




module.exports = {
    courseRouter:courseRouter
};