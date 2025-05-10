const mongoose=require("mongoose");

const blackListedToken=mongoose.Schema({
    blackListedToken:{
        type: String,
        required: true,
        unique:true
    }
});

const BlackListedTokenSchema=mongoose.model("BlacklistedToken", blackListedToken,"BlacklistedToken");

module.exports=BlackListedTokenSchema;