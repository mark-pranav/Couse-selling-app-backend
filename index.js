const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');


const app = express();


app.use("/user" , userRouter);
app.use("/course" , courseRouter);












app.listen(3000);

