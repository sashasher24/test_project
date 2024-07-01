const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker')
const request = require('supertest');
// const {carsCollection} = require('./setupTests')


const {app, server} = require('../server')
require('dotenv').config();

const userURI = process.env.DB_URL
const client = new MongoClient(userURI);

const testPort = 3002; // Use a different port for testing

describe('mongo db API tests -- car', () => {
    let carsCollection

    beforeAll(async () => {
        try {
            await client.connect();    
            const myTestDb = await client.db('test')
            carsCollection = myTestDb.collection('cars')
            testServer = app.listen(testPort, () => console.log(`Test server started on port ${testPort}`));
        } catch (e) {
            console.error(e);
        }
    })
    
    it('should create new car', async () => {
        let newCar = {
            model: faker.vehicle.manufacturer(),
            year: faker.number.int({ min: 1980, max: 2024 })
        }

        let response = await request(app).post('/cars/add').send(newCar)
        let newCarInTheDb = await carsCollection.findOne({model: newCar.model})

        expect(response.statusCode).toEqual(200)
        expect(newCarInTheDb.year).toEqual(newCar.year)
    })

    it('should return all cars', async () => {
        // let newUsers = [];
        // let number_of_users_to_add = 5;
    
        // for (let i = 0; i < number_of_users_to_add; i++) {
        //   newUsers.push({
        //     name: faker.person.firstName(),
        //     email: faker.internet.email(),
        //   });
        // }
    
        // const result = await carsCollection.insertMany(newUsers);
        // expect(result.insertedCount).toBe(number_of_users_to_add);
    })

    afterEach(async () => {
        await carsCollection.deleteMany({ 'model': { $ne: 'my fav car' } });
    })

    afterAll(async () => {
        await client.close();
        await testServer.close();
        await server.close()
        console.log(`Test server ${testPort} closed`);
    })
})