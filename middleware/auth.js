const jwt= require('jsonwebtoken');
const BlackListedTokenSchema = require('../models/blackListedToken');
const { isGroupOwner, isMemberAdded } = require('./Validations/groupValidations');

const auth=async(req, res, next)=>{
    try {

        const token= req.headers.authorization.split(" ")[1];
        const isCustomToken=token.length < 500 ;
        let decodedData;

        if(!token){
            return res.status(401).json({
                status:"Failed",
                message:"UNAUTHORIZED"
            })
        }

        if(token && isCustomToken){
            decodedData= jwt.decode(token, process.env.JWT_PASS_KEY);    
            if(!decodedData){
                return res.status(401).json({
                    status:"Failed",
                    message:"UNAUTHORIZED"
                })
            }

            if(!new Date((decodedData?.exp)*1000) > new Date()){
                return res.status(400).json({
                    status:"Failed",
                    message:"User Logged out"
                })
            }  
            req.body.userId=decodedData?.id;
        }else{
            decodedData=jwt.decode(token);
            req.body.userid=decodedData?.sub;
        }
    
        next();

    } catch (error) {
        console.log(error);
    }
}

const isTokenBlacklisted=async(req,res,next)=>{

    try {
        const token= req.headers.authorization;
    
        const isTokenBlacklisted=await BlackListedTokenSchema.findOne({
            blackListedToken: token
        })
    
       if(isTokenBlacklisted){
            return res.status(400).json({
                status:"Failed",
                message:"User Logged out"
            })
       }

       next();
        
    } catch (error) {
        console.log(error);
    }
}


const onlyOwner=async(req,res,next)=>{
    try {

        const userId=req.body.userId;
        const groupId= req.body.groupId;

        if(userId && !await isGroupOwner(groupId, userId)){
            return res.status(401).json({
                status:"Failed",
                message:"Only Group Owner"
            })
        };

        next();
        
    } catch (error) {
        console.error(error)
    }
}

const onlyMember=async(req,res,next)=>{
    try {
        const userId=req.body.userId;
        const groupId= req.body.groupId;

        if(userId && !await isMemberAdded(groupId, userId)){
            return res.status(401).json({
                status:"Failed",
                message:"UNAUTHORIZED"
            })
        }

        next();

    } catch (error) {
        console.error(error)
    }
}


module.exports={
    auth, 
    isTokenBlacklisted,
    onlyOwner,
    onlyMember
};