const http = require('http');
const app = require("express")();

// Load static pages
app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));
app.listen(9091, () => console.log("Frontend on port 9091"));


const websockerServer = require('websocket').server;

const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening on 9090"))

// Upgrade http server to websocket server
const wsServer = new websockerServer({
    httpServer
})

const clients = {};
const games = {};

wsServer.on('request', req => {
    // connect
    const connection = req.accept(null, req.origin)
    connection.on('open', () => console.log('OPENED!'))
    connection.on('close', () => console.log('CLOSED!'))
    connection.on('message', message => {
        const result = JSON.parse(message.utf8Data)

        // Received message from client
        // user wants to create a new game
        if (result.method = 'create') {

            const clientId = result.clientId
            const gameId = guid();
            games[gameId] = {
                id: gameId,
                balls: 20
            }

            const payLoad = {
                method: 'create',
                game: games[gameId]
            }

            const con = clients[clientId].connection
            con.send(JSON.stringify(payLoad));
        }
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
    return Math.floor(
        (1 + Math.random()) * 0x10000
    ).toString(16).substring(1);
}

const guid = () => `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;