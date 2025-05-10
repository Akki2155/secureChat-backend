const UserModel=require("../../models/users.js");

const getUserDetails=async(userId)=>{
   
    const requestedUser = await UserModel.findOne({
        [userId.includes('@') ? 'emailId' : userId.length==10? 'phonenumber': '_id']: userId
    });

    if(!requestedUser){
        return null;
    }else{
        return requestedUser;
    }
}


module.exports={
    getUserDetails
}