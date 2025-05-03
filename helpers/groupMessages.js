const { USER_NOT_MEMBER } = require("../constants");
const { isMemberAdded } = require("../middleware/Validations/groupValidations.js");
const MessageModal= require("../models/message.js")

const getGroupAllEncryptedMessage=async(groupId, userID)=>{
    if(! await isMemberAdded(groupId, userID)){
               return USER_NOT_MEMBER;
    };
    const messages= await MessageModal.find({groupId});

    return messages
}

const getGroupEncryptedMessage=async(groupId, userId, messageId)=>{
    if(! await isMemberAdded(groupId, userId)){
               return USER_NOT_MEMBER;
    };
    const messages= await MessageModal.find({_id: messageId});

    return messages
}


module.exports={
    getGroupAllEncryptedMessage,
    getGroupEncryptedMessage
}