const { encryptMessage } = require("../../helpers/messageTransform.js");
const { getGroupDetails, isMemberAdded, isGroupOwner } = require("../../middleware/Validations/groupValidations.js");
const { getUserDetails } = require("../../middleware/Validations/userValidations.js");
const GroupModal=require("../../models/group.js");
const MessageModal=require("../../models/message.js");
const UserModal= require("../../models/users.js")
const bcrypt=require('bcrypt');

const createGroup=async(req,res)=>{
    const {groupName, userId, groupKey}=req.body;
    const hashedPassword=await bcrypt.hash(groupKey, 12);
    const result = await GroupModal.create({
        groupName,
        owner:userId,
        members:[userId],
        password:hashedPassword
    })

    const filter={
        _id: userId
    }

    const updateDoc = {
        $push: {
          groupMembered: result.id, 
        },
      };

    const existingUser= await UserModal.updateOne(filter, updateDoc);

    if(!result){
        return res.status(400).json({
            res:"Failed",
            message:"Couldn't create group!"
        }); 
    }else{
        return res.status(200).json({
            res:"Success",
            message:"Group created successfully!"
        }) 
    }
}

const addMemberGroup=async(req,res)=>{
    try {
        const {memberEmail, groupId} =req.body;
        const requestedUser=await getUserDetails(memberEmail);

        if(!requestedUser){
            return res.status(400).json({
                res:"Failed",
                message:"Requested User Not found"
            })     
        };

        const requestedGroup=await getGroupDetails(groupId)

        if(!requestedGroup){
            return res.status(400).json({
                res:"Failed",
                message:"Requested Group Not found"
            })     
        }

        if(await isMemberAdded(groupId, memberEmail)){
            return res.status(400).json({
                res:"Failed",
                message:"Member Already present"
            });
        }

        requestedGroup.members.push(requestedUser.id);
        const result = await requestedGroup.save();
        requestedUser.groupMembered.push(requestedGroup.id);
        const userResult=await requestedUser.save();

        if(!result || !userResult){
            return res.status(500).json({
                res:"Failed",
                message:"Internal Server Error"
            })
        }

        return res.status(200).json({
            res:"Success",
            message:"User added as memeber"
        });

    } catch (error) {
       console.error(error);
       return res.status(500).json({
            res:"Failed",
            message:"Something Went Wrong, try again!!"
       });
    }
    

}


const sendMessage=async(req, res)=>{

    try {
        const {message, groupId, userId}=req.body;

    const requestedGroup=await getGroupDetails(groupId);
    if(!requestedGroup){
        return res.status(400).json({
            res:"Failed",
            message:"Requested Group Not found"
        })     
    }

    //Encryption Fucntionality Leave
    const encryptedMessage= encryptMessage(message, requestedGroup.password);
    
    const messageRes= await MessageModal.create({
        message:encryptedMessage,
        sender:userId,
        groupId
    })

    if(!messageRes){
        return res.status(400).json({
            res:"Failed",
            message:"Couldn't send message, try again!"
        })
    };

    return res.status(200).json({
        res:"Success",
        messageRes
    })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            res:"Failed",
            message:"Something went wrong!!"
        })
    }    
}


module.exports={
    createGroup,
    addMemberGroup,
    sendMessage
}