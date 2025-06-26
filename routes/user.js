const { Router } = require("express");
const userRouter = Router();
const { userModel } = require("../db");
const z = require("zod");
const  bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_USER_SECRET = "PRANAV252002";

userRouter.post("/signup", async function (req, res) {
    // form field validation using zod 
    const requireBody = z.object({
        email : z.string().min(5).max(50).email(),
        firstName : z.string().min(3).max(50),
        lastName: z.string().min(3).max(20),
        password : z.string().min(6).max(20).refine(
            (password) => /[A-Z]/.test(password),
            {
                message: "Password must contain atleast on UpperCase character"
            }
        ).refine(
            (password) => /[a-z]/.test(password),
            {
                message: "Password must contain atleast one Lowercase character"
            }
        )
    });

    const parseDatawithSuccess = requireBody.safeParse(req.body); 

    if(!parseDatawithSuccess.success){
        res.json({
            message: "failed ",
            error : parseDatawithSuccess.error
            
        })
        return
    }

    // ended
    // authentication using bcrypt started
    const { email , firstName , lastName , password } = req.body;
    let errorFlag = false;

    try{ 
        const hashPassword = await bcrypt.hash(password, 5);
        console.log(hashPassword);

        await userModel.create({
            email : email,
            firstName : firstName ,
            lastName : lastName, 
            password: hashPassword
        })

    }catch(e){
        res.json({
            message: "User already exists"
        })
        errorFlag=true;
    }

    if(!errorFlag){

        res.json({
            message: "you are logged in"
        })
    }

});

userRouter.post("/signin", async function (req, res) {
    const { email , password } = req.body;

    const user = await userModel.findOne({
        email : email
    });
    if(!user){
        res.status(403).json({
            message: "Account doesn't exist , Signup first"
        })
    }


    const matchPassword = await bcrypt.compare(password, user.password);
    if(matchPassword){
        const token = jwt.sign({
            id : user._id.toString()
        }, JWT_USER_SECRET);
        res.json({
            token
        })
    }
    else{
        res.status(403).json({
        message: "Incorrect credentials"
        });
    }


});

userRouter.get("/purchases", function (req, res) {
  res.json({
    message: "You're purchases course",
  });
});

module.exports = {
  userRouter: userRouter,
};
