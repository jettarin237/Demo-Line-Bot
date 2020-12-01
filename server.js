var express = require('express')
var bodyParser = require('body-parser')
var request = require('request-promise')

var app = express()

app.set('port',(process.env.PORT || 3000))

app.use('/', express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/helloworld',(req,res) => {
    // console.log(req);
    res.send("Hello world from server port: " + app.get('port'));
})

app.post('/', (req,res) => {
    res.send('Hi')
    console.log(req.body.event[0].message);
    console.log(req.body.event[1].message);
    
})

app.post('/webhook', (req,res) => {
    // console.log('Webhook request');
    // console.log(req.body.events[0].message.text)
    console.log(req.body.events)
    replyToken = req.body.events[0].replyToken;
    msg = req.body.events[0].message.text;
    reply(replyToken, msg);
    res.send('Hi')
})



function reply(replyToken, msg) {
    var lists = ["Hello" , "Zero Two", "เวลาเริ่มทำงาน","สถิติการใช้งาน","การใช้งานห้องสมุด"]
    var body = JSON.stringify({
        replyToken: replyToken,
        messages: [
            {
                type: 'text',
                text : 'ถ้าพิมพ์คำเหล่านี้จะได้คำตอบ ' + lists
            }
        ]
    })
    if(msg == "Hello"){
        var body =JSON.stringify({
            replyToken: replyToken,
                messages: [
                    {
                        type: 'text',
                        text: msg
                    }
                ]
            }
        )
    }
    else if (msg == "Zero Two") {
        var body = JSON.stringify({
            replyToken: replyToken,
            messages : [{
                type: "image",
                originalContentUrl: "https://i.pinimg.com/originals/c4/0d/4f/c40d4fbea48efeba107674737d42bd3a.png",
                previewImageUrl: "https://i.pinimg.com/originals/c4/0d/4f/c40d4fbea48efeba107674737d42bd3a.png",
            }]
        })
    }
    else if(msg == "สถิติการใช้งาน" || msg == "การใช้งานห้องสมุด"){
        var body = JSON.stringify({
            replyToken: replyToken,
            messages : [{
                type: 'text',
                text: 'https://www.lib.buu.ac.th/web/index.php/en/service-statistics/'
            }]
        })
    }
    else if (msg == "เวลาเริ่มทำงาน" || msg == "เริ่ม") {
        var body = JSON.stringify ({
            replyToken: replyToken,
            messages : [{
                type : 'text',
                text: '10.00'
            }]
        })
    }
    else if (msg == "คู่มือ"){
        var body = JSON.stringify({
            replyToken: replyToken,
            messages : [{
                type: 'text',
                text: 'การจองห้องศีกษากลุ่ม\n'+ 'http://www.lib.buu.ac.th/download/service/Group_Study_Room_Reservation_Thai.pdf \n' + 
                'การจองห้องมัลติมีเดีย\n' + 'http://www.lib.buu.ac.th/download/service/Multimedia_Room_Reservation_Thai.pdf \n'
            }]
        })
    }
    else {
        var body = JSON.stringify({
            replyToken: replyToken,
            messages: [
                {
                    type: 'text',
                    text : 'ถ้าพิมพ์คำเหล่านี้จะได้คำตอบ' + lists
                }
            ]
        })
    }
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EyUa06YHmYxoz2kpQVJeNcm7GTj1QTAsImCsYaOKJRDK458meFtp5Zr/ZxKd2g2Pd2HM4qvHHV0+qd1On0K7qFrq9ZqsyAIWDT+YePuk9xVjWt/83BYHRMC3XrsA6ylxUcYWEApfqnePGX/m2NF/FAdB04t89/1O/w1cDnyilFU='
    }

    
    
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    },(err, res, body) => {
        console.log('err = ' + err);
        console.log('status = ' + res.statusCode);
    })
}

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port')+ '/')
})