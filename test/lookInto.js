const { MongoClient } = require('mongodb');
const { app } = require('../server'); // Ensure you are not importing server if not needed
require('dotenv').config();

const userURI = process.env.DB_URL;
const client = new MongoClient(userURI);

let usersCollection, carsCollection;
let testServer;
const testPort = 3001; // Use a different port for testing

const setup = async () => {
    try {
        await client.connect();
        const myTestDb = await client.db('test');
        usersCollection = myTestDb.collection('users');
        carsCollection = myTestDb.collection('cars');
        testServer = app.listen(testPort, () => console.log(`Test server started on port ${testPort}`));
    } catch (e) {
        console.error(e);
    }
};

const teardown = async () => {
    await client.close();
    if (testServer) {
        await testServer.close();
        console.log(`Test server ${testPort} closed`);
    }
};

beforeAll(async () => {
    await setup();
});

afterAll(async () => {
    await teardown();
});

module.exports = { usersCollection, carsCollection, testPort };