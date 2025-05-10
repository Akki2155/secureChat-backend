const mongoose= require('mongoose');

const groupSchema=mongoose.Schema({
    groupName: {
        type:String,
        required: true,
        unique: true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:false
    },
    members:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User"
    },
    password:{
        type:String,
        required:true
    } 

})

const GroupSchema=mongoose.model('Group', groupSchema, "Group");

module.exports=GroupSchema