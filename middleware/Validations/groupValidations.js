const GroupModal=require("../../models/group.js");
const { getUserDetails } = require("./userValidations.js");


const getGroupDetails=async(groupName)=>{
    const requestedGroup=await GroupModal.findOne({
        id:groupName
    })
    if(!requestedGroup){
        return null;
    }else{
        return requestedGroup;
    }
}

const isMemberAdded=async(groupName, userId)=>{  
    const requestedGroup=await getGroupDetails(groupName);
    const requestedUser=await getUserDetails(userId);
    
    if(requestedGroup && requestedUser){
        return requestedGroup.members.includes(requestedUser.id);
    }else{ 
        return false;
    }
}

const isGroupOwner=async(groupName, userId)=>{
    const requestedGroup=await getGroupDetails(groupName);
    const requestedUser=await getUserDetails(userId);

    return requestedGroup.owner == requestedUser.id;
    
}


module.exports={
    getGroupDetails,
    isMemberAdded,
    isGroupOwner
};