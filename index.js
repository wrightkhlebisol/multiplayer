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

    connection.on('open', () => console.log('OPENED!'))
    connection.on('close', () => console.log('CLOSED!'))
    connection.on('message', message => {
        const clientMessage = JSON.parse(message.utf8Data)

        // Received message from client
        // user wants to create a new game
        if (clientMessage.method === 'create') {

            const clientId = clientMessage.clientId
            const gameId = guid();
            games[gameId] = {
                id: gameId,
                balls: 20,
                clients: []
            }

            const con = clients[clientId].connection

            const response = {
                method: 'create',
                game: games[gameId]
            }

            con.send(JSON.stringify(response));
        }

        if (clientMessage.method === 'join') {
            const _clientId = clientMessage.clientId;
            const _gameId = clientMessage.gameId;
            if (!_gameId || !games[_gameId]) return;


            const game = games[_gameId];
            if (game && game.clients.length >= 3) {
                // max players reach
                return;
            }

            let color = {
                0: 'Red', 1: 'Green', 2: 'Blue'
            }[game?.clients.length];
            console.log(color);
            game.clients.push({
                clientId: _clientId,
                color,
            })
            const response = {
                method: 'join',
                game,
                color
            }

            game.clients.forEach(client => {
                // Ensure client doesn't already exist
                clients[client.clientId].connection.send(JSON.stringify(response));
            });

        }
    })
})

function s4() {
    return Math.floor(
        (1 + Math.random()) * 0x10000
    ).toString(16).substring(1);
}

const guid = () => `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;