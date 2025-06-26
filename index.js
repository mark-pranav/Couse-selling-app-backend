const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');



const app = express();


app.use("/user" , userRouter);
app.use("/course" , courseRouter);
app.use("/admin" , adminRouter);


async function main(){
    await mongoose.connect("mongodb+srv://admin:tR2udl4Yz18snT1E@cluster0.uwlhvre.mongodb.net/course-selling-app");
    app.listen(3000);
    console.log("Listening on port 3000")

}

main();
