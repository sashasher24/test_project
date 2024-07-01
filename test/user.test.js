const { MongoClient } = require('mongodb')
const { faker } = require('@faker-js/faker')
const request = require('supertest')
const { app } = require('../server')
require('dotenv').config()

const userURI = process.env.DB_URL
const client = new MongoClient(userURI)

describe('MongoDB API tests -- user', () => {
  let testServer
  let usersCollection
  const testPort = 3001 // Use a different port for testing

  beforeAll(async () => {
    try {
      await client.connect()
      const myTestDb = await client.db('test')
      usersCollection = myTestDb.collection('users')
      testServer = app.listen(testPort, () => console.log(`Test server started on port ${testPort}`))
    } catch (e) {
      console.error(e)
    }
  })

  it('should create new user', async () => {
    const newUser = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
    }

    const response = await request(app).post('/users/add').send(newUser)
    const newUserInTheDb = await usersCollection.findOne({ email: newUser.email })

    expect(response.statusCode).toBe(200)
    expect(newUserInTheDb.name).toEqual(newUser.name)
  })

  it('should return all users', async () => {
    const response = await request(app).get('/users')
    const usersFromDb = await usersCollection.find({}).toArray()

    expect(response.body.users.length).toEqual(usersFromDb.length)
  })

  it('should delete a user', async () => {
    const newUser = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
    }

    await request(app).post('/users/add').send(newUser)
    const deleteResponse = await request(app).delete('/users').send({ email: newUser.email })

    const deletedUser = await usersCollection.findOne({ email: newUser.email })

    expect(deleteResponse.statusCode).toBe(200)
    expect(deletedUser).toBe(null)
  })

  afterEach(async () => {
    await usersCollection.deleteMany({ email: { $ne: 'sasha@email.com' } })
  })

  afterAll(async () => {
    await client.close()
    if (testServer) {
      await testServer.close()
      console.log(`Test server ${testPort} closed`)
    }
  })
})