## Jest, Node.js, MongoDB test

### To run the local server:

`node server.js`

this will allow to send requests to the localhost:{{PORT}}

**Available endpoints:**

- **GET /cars**

returns all documents in the 'cars' collection

- **POST /cars/add**

adds a document to the 'cars' collection

body: 
```
{
    "model": STRING,
    "year": NUMBER
}
```

- **GET /users**

returns all documents in the 'users' collection

- **POST /users/add**

adds a document to the 'users' collection

body: 
```
{
    "name": STRING,
    "email": STRING
}
```

- **DELETE /users**

deletes a document by email

body: 
```
{
    "email": STRING
}
```

### To run tests

`npm run test`

Tests are sending API requests to the local server and checking their actions in the DB