const http = require('http');
const app = require("express")();

app.listen(9091, () => console.log("Frontend on port 9091"));

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

const websockerServer = require('websocket').server;

const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening on 9090"))

const clients = {};

const wsServer = new websockerServer({
    httpServer
})

wsServer.on('request', req => {
    // connect
    const connection = req.accept(null, request.origin)
    connection.on('open', () => console.log('OPENED!'))
    connection.on('close', () => console.log('CLOSED!'))
    connection.on('message', message => {
        const result = JSON.parse(message.utf8Data)
        console.log(result);
    })

    // Generate a new clientId
    const clientId = guid();
    clients[clientId] = {
        connection
    }

    const payLoad = {
        method: 'connect',
        clientId
    }

    // Send back the client connection
    connection.send(JSON.stringify(payLoad));
})

function s4() {
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

const guid = () => `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;