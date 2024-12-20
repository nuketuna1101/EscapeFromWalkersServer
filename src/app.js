//====================================================================================================================
//====================================================================================================================
// app.js
//====================================================================================================================
//====================================================================================================================

import express from 'express';
import { createServer } from 'http';
// inits
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/asset.js';

const app = express();
const server = createServer(app);
const PORT = 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 소켓 시작
initSocket(server);

// 
server.listen(PORT, async () => {
    console.log(`:: Server is running on port ${PORT}`);

    try {
        // Asset loading
        const assets = await loadGameAssets();
        console.log('Assets loaded successfully: ', assets);
    } catch (error) {
        console.error('Failed to load game assets:', error);
    }
});