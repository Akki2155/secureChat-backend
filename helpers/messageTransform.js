const CryptoJS = require('crypto-js');

const encryptMessage=(text, password)=>{
    return CryptoJS.AES.encrypt(text, password).toString();
}

const decryptMessage=(cipherText, password)=>{
    const bytes = CryptoJS.AES.decrypt(cipherText, password);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports={
    encryptMessage,
    decryptMessage
}