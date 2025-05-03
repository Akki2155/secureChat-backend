const express = require('express');
const { auth, isTokenBlacklisted, onlyOwner, onlyMember } = require('../middleware/auth');
const { getGroupAllMessages, getDummyMessages, sendDummyMessage, getUserAllGroups, decryptGroupAllMessages, decryptGroupMessage } = require('../controllers/ChatGroups/getCalls');
const { createGroup, addMemberGroup, sendMessage } = require('../controllers/ChatGroups/postCalls');
const { isMemberAdded } = require('../middleware/Validations/groupValidations');

const router=express.Router();

router.get("/default", (req, res)=>{
    res.send("Group chat default endpoint");
});

//Post Calls

router.post("/createGroup", createGroup);
router.post("/addMember", [onlyOwner], addMemberGroup);
router.post("/sendMessage",sendMessage);


// Get Calls
router.get("/allMessages", getGroupAllMessages);
router.get("/allDecryptedMessages", decryptGroupAllMessages);
router.get("/decryptMessage", decryptGroupMessage)
router.get("/getUserGroups", getUserAllGroups)


module.exports=router