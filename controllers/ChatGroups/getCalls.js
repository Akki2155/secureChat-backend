const GroupModal=require("../../models/group.js")
const MessageModal= require("../../models/message.js")
const UserModel=require('../../models/users.js');
const socket= require("../../helpers/socket.js");
const { getUserDetails } = require("../../middleware/Validations/userValidations.js");


let messages=[{
    username:'h1T_HSaYeyQgaZ3cAAAD',
    message:'Check message 1'
},
]

const getGroupAllMessages=async(req, res)=>{
    const {groupId, userId, }=req.body;


    return res.status(200).json({
        groupId,
        userId
    })
    


}

const decryptGroupAllMessages=async(req,res)=>{
    const {groupId, userId, decodeKey}= req.body;


}

const decryptGroupMessage=async(req, res)=>{
    const {groupId, userId, decodeKey, messageId}=req.body;


}

const getUserAllGroups=async(req, res)=>{
    const {userId}=req.body;
    console.log(userId)

    const userGroups=await GroupModal.find({
        $or: [
          { owner: userId },                  
          { members: { $in: [userId] } }      
        ]
      })

    

    return res.status(200).json({
        res:"Success",
        userGroups
    })
    
}




module.exports={
    getGroupAllMessages,
    decryptGroupAllMessages,
    decryptGroupMessage,
    getUserAllGroups
}