const mongoose = require('mongoose');

const messageSchema= mongoose.Schema({
    message: String,
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    edited: {
        type: Boolean,
        default: false
    },
    editedHistory:[String],
    sentAt:{
        type: String,
        default: Date.now().toString()
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true
    }

})


const MessageSchema=mongoose.model('Message', messageSchema,"Message");

module.exports=MessageSchema;