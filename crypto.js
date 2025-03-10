const crypto =  require("crypto-js");
const env = require("dotenv");

//
const my_password = "demo1";
//const my_key = ("mamamacall");
const my_key =process.env.SECRET_KEY;

const password = crypto.AES.encrypt(my_password,my_key);
console.log('passeord',password.toString());

// decode
const data = crypto.AES.decrypt(password,toString() ,my_key);
console.log('data' , data.toString(crypto.enc.Utf8));