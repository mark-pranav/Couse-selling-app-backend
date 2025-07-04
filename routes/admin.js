const {Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db")
const {z} = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const  { JWT_ADMIN_SECRET } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const { mongoose } = require('mongoose');
const course = require("./course");



adminRouter.post("/signup" , async function(req,res){

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

        await adminModel.create({
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
})

adminRouter.post("/signin" , async function(req,res){
    const { email , password } = req.body;

    const admin = await adminModel.findOne({
        email : email
    });
    if(!admin){
        res.status(403).json({
            message: "Account doesn't exist , Signup first"
        })
    }


    const matchPassword = await bcrypt.compare(password, admin.password);
    if(matchPassword){
        const token = jwt.sign({
            id : admin._id.toString()
        }, JWT_ADMIN_SECRET);
        res.json({
            token
        })
    }
    else{
        res.status(403).json({
        message: "Incorrect credentials"
        });
    }
})

adminRouter.post("/createCourse" , adminMiddleware, async function(req,res){
    const adminId = req.userId;
    const { title , description , price ,  image_url } = req.body;

    const course = await courseModel.create({
        title,
        description, 
        price,  
        image_url,
        creatorId : adminId
    })


    res.json({
        message: "course created",
        courseId : course._id
    })
})


adminRouter.put("/Course" , adminMiddleware, async function(req,res){
    const adminId = req.userId;
    const { title , description , price ,  image_url , courseId } = req.body;

    
    const course = await courseModel.findOne({
        _id: courseId,
        creatorId: adminId
    });

    if(!course){
         return res.status(403).json({
            message: "course is not found or you not authorized"
        })
    }

    await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId,
    }, {
        title: title || course.title,
        description: description || course.description,
        image_url: image_url || course.image_url,
        price: price || course.price,
    })

    res.json({
        message: "course updated",
        courseId : course._id
    })
})

adminRouter.get("/course/bulk" , adminMiddleware , async function(req,res){
    const adminId = req.userId;
    const courses = await courseModel.find({
    
        creatorId : new mongoose.Types.ObjectId(adminId)
    });


    res.json({
        message: "courses view",
        courses
    })
})




module.exports = {
    adminRouter:adminRouter
}

console.log("JWT_ADMIN_SECRET:", JWT_ADMIN_SECRET); // Should print your secret