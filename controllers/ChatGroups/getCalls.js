const GroupModal=require("../../models/group.js")
const bcrypt=require('bcrypt');
const MessageModal= require("../../models/message.js")
const UserModel=require('../../models/users.js');
const socket= require("../../helpers/socket.js");
const { getUserDetails } = require("../../middleware/Validations/userValidations.js");
const { isMemberAdded, getGroupDetails } = require("../../middleware/Validations/groupValidations.js");
const { getGroupAllEncryptedMessage, getGroupEncryptedMessage } = require("../../helpers/groupMessages.js");
const { USER_NOT_MEMBER } = require("../../constants.js");
const { decryptMessage } = require("../../helpers/messageTransform.js");


let messages=[{
    username:'h1T_HSaYeyQgaZ3cAAAD',
    message:'Check message 1'
},
]

const getGroupAllMessages=async(req, res)=>{
    try {
        const {groupId, userId}=req.body;
        const messages= await getGroupAllEncryptedMessage(groupId, userId)
        
        if(messages==USER_NOT_MEMBER){
            return res.status(400).json({
                res:"Failed",
                message:"User is not Member of Group"
            });
        };
    
        return res.status(200).json({
            res:"Success",
            messages
        });
    } catch (error) {
        console.log('Error in GetAllMessages', error);
        return res.status(500).json({
            res:"Failed",
            message:"Something went wrong."
        });
    }
    


}

const decryptGroupAllMessages=async(req,res)=>{
    const {groupId, userId, groupKey}= req.body;

    const messages= await getGroupAllEncryptedMessage(groupId, userId)
        
    if(messages==USER_NOT_MEMBER){
        return res.status(400).json({
            res:"Failed",
            message:"User is not Member of Group"
        });
    };

    const groupDetails= await getGroupDetails(groupId);
    const isKeyValid= await bcrypt.compare(groupKey, groupDetails.password);

    if(!isKeyValid){
        return res.status(400).json({
            res:"Failed",
            message:"Group Key is not Valid"
        });
    }

    for(let message of messages){
       let decrypted=decryptMessage(message.message, groupDetails.password)
       message.message = decrypted;
    }

    return res.status(200).json({
        res:"Success",
        messages
    });

}

const decryptGroupMessage=async(req, res)=>{
    const {groupId, userId, groupKey, messageId}=req.body;

    const messages= await getGroupEncryptedMessage(groupId, userId, messageId)
        
    if(messages==USER_NOT_MEMBER){
        return res.status(400).json({
            res:"Failed",
            message:"User is not Member of Group"
        });
    };

    const groupDetails= await getGroupDetails(groupId);
    const isKeyValid= await bcrypt.compare(groupKey, groupDetails.password);
    if(!isKeyValid){
        return res.status(400).json({
            res:"Failed",
            message:"Group Key is not Valid"
        });
    }

    let decrypted=decryptMessage(messages[0].message, groupDetails.password)
    // messages[0].message = decrypted;
  
    return res.status(200).json({
        res:"Success",
        message:decrypted
    });
    

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