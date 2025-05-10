const express=require('express');
const { createUser, userlogin, deleteUser, userLogout } = require('../controllers/userControllers');


const router=express.Router();


router.get("/default", (req, res)=>{
    res.send("User default Endpoint")
})

router.post("/createuser", createUser);
router.post("/login", userlogin);
router.delete("/deleteuser", deleteUser);
router.post("/logout", userLogout);


module.exports=router;