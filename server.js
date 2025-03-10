const express = require('express');
const {PrismaClient} = require("@prisma/client");
const bodyParser = require("body-parser")
const crypto = require("crypto-js");
const env = require("dotenv");

env.config();
function encodeData(data){
    const password = crypto.AES.encrypt(data, process.env.SECRET_KEY);
    return password.toString();
}

function decodeData(data){
    const password = crypto.AES.decrypt(data, process.env.SECRET_KEY);
    return password.toString(crypto.enc.Utf8);
}

const app = express()
app.use(bodyParser.json())
const prisma =  new PrismaClient();
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/user', async (req,res) =>{
    const data = await prisma.$queryRaw `select id, username, cardid from user`;
    const finalData = data.map(record => ({
        ...record,
        cardId: decodeData(record.cardId)
    }));
    console.log(finalData);
    res.json({
        message: 'okay',
        data: finalData
    })
});

app.post('/user', async (req, res) =>{
    console.log(req.body)
    const response = await prisma.user.create({
        data: {
            username: req.body.username,
            password: encodeData(req.body.password),
            cardId: encodeData(req.body.cardId)
        }
    });
    if(response){
        res.json({
            message: "add successfully"
        })
    }else{
        res.json({
            message: "failed"
        })
    }
});

app.put('/user', async (req, res) => {
    const response = await prisma.user.update({
        select: {
            password: true,
            id: true
        },
        where: {
            id: req.body.id
        },
        data: {
            password: encodeData(req.body.password)
        }
    });
    if (response) { 
        res.json({
            message: "update sucessfully"
        })
    } else { 
        res.json({
            message: "update fail"
    })}
});

app.delete('/user', async (req, res) => {
    const response = await prisma.user.delete({
        where: {
            id: req.body.id
        },
        select:{
            username: true
        }
       });
       if (response) { 
        res.json({
            message: "delete sucessfully"
             })
        } else { 
            res.json({
                message: "delete fail"
    })}
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})