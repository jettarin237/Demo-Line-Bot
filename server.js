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
    console.log(req.body.event[0].message);
    console.log(req.body.event[1].message);
    res.send('Hi')
})

app.post('/webhook', (req,res) => {
    console.log('Webhook request');
    console.log('req.body.events[0].message.text')
    replyToken = req.body.events[0].replyToken;
    msg = req.body.events[0].message.text;
    reply(replyToken, msg);
    res.send('Hi')
})

function reply(replyToken, msg) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EyUa06YHmYxoz2kpQVJeNcm7GTj1QTAsImCsYaOKJRDK458meFtp5Zr/ZxKd2g2Pd2HM4qvHHV0+qd1On0K7qFrq9ZqsyAIWDT+YePuk9xVjWt/83BYHRMC3XrsA6ylxUcYWEApfqnePGX/m2NF/FAdB04t89/1O/w1cDnyilFU='
    }
    let body =JSON.stringify({
        replyToken: replyToken,
        messages: [{
            type: 'text',
            text: 'Hello from webhook'
        },
        {
            type: 'text',
            text: msg
        }
    ]
    })
    
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