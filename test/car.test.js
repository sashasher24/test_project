const { MongoClient } = require('mongodb')
const { faker } = require('@faker-js/faker')
const request = require('supertest')
const { app } = require('../server')
require('dotenv').config()

const userURI = process.env.DB_URL
const client = new MongoClient(userURI)

const testPort = 3002 // Use a different port for testing

describe('MongoDB API tests -- car', () => {
  let carsCollection
  let testServer

  beforeAll(async () => {
    try {
      await client.connect()
      const myTestDb = await client.db('test')
      carsCollection = myTestDb.collection('cars')
      testServer = app.listen(testPort, () => console.log(`Test server started on port ${testPort}`))
    } catch (e) {
      console.error(e)
    }
  })

  it('should create new car', async () => {
    const newCar = {
      model: faker.vehicle.manufacturer(),
      year: faker.number.int({ min: 1980, max: 2024 })
    }

    const response = await request(app).post('/cars/add').send(newCar)
    const newCarInTheDb = await carsCollection.findOne({ model: newCar.model })

    expect(response.statusCode).toEqual(200)
    expect(newCarInTheDb.year).toEqual(newCar.year)
  })

  it('should return all cars', async () => {
    const response = await request(app).get('/cars')
    const carsFromDb = await carsCollection.find({}).toArray()

    expect(response.body.cars.length).toEqual(carsFromDb.length)
  })

  afterEach(async () => {
    await carsCollection.deleteMany({ model: { $ne: 'my fav car' } })
  })

  afterAll(async () => {
    await client.close()
    if (testServer) {
      await testServer.close()
      console.log(`Test server ${testPort} closed`)
    }
  })
})