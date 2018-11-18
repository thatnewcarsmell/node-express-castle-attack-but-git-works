# Castle Attack

This project will have you building a server side application that allows someone to build a secret kingdom with multiple castles. Careful though! Other people who know how to find your castle will be able to attack it!

## Setup

1. Fork and clone this repository
1. Run `npm install` or `yarn`
1. Run tests with `npm test`
1. Run the server in development mode with `npm run dev` or in production mode with `npm start`

## Dependencies

The following are already installed for you to use.

- [Express](https://www.npmjs.com/package/express)
- [morgan](https://www.npmjs.com/package/morgan)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [galvanize-game-mechanics](https://www.npmjs.com/package/galvanize-game-mechanics)

## Tests

You can run the tests with `npm test`. The tests inside of `test/02.castles.routes.js` are pending! That means they will not run until you un-pend them. To do so, remove the `x` in front of the first `describe` statement.

```
xdescribe(...) -> describe(...)
```

## Instructions

To complete this project, complete the following tasks in accordance with the tests.

- [ ] Write code to start a server in `app.js`
- [ ] Add express, morgan, and body-parser to the `app.js` file
- [ ] Use the [galvanize-game-mechanics](https://www.npmjs.com/package/galvanize-game-mechanics) library to create Kingdoms with Castles.  These will be in the memory of the server and not stored on the file system.

__Note: For the routes below each response should include a `data` key to preface whatever information is getting returned.__ 

- [ ] Create the following routes with appropriate responses: 
  - [ ] **POST /kingdoms**: Creates a new Kingdom. Client may send a `name` key in the body which will be the name of the kingdom. Store this kingdom in memory with other kingdoms for use in other routes.
  - [ ] **GET /kingdoms**: Gets all Kingdoms.
  - [ ] **GET /kingdoms/:id**: Returns the specified Kingdom. If it does not exist, throw an error message. If it does exist, return information about the kingdom alone -- no castle information should be in it.
  - [ ] **GET /kingdoms/:id/castles**: Returns all castles associated with the kingdom. No information about the kingdom should be included.
  - [ ] **GET /kingdoms/:id/castles/:castleId**: Returns the specific castle with its information. If not found, returns an error.
  - [ ] **POST /kingdoms/:id/castles**: Creates a new castle for the specified kingdom. If three castles are already created, returns an error. Otherwise, returns the newly created castle. Client may send a `name` key in the body which will be the name of the castle.
  - [ ] **POST /kingdoms/:id/castles/:castleId**: Updates the castle in some way. To attack the castle (deal damage to it), send `{ action: 'attack' }`. To rebuild the castle (restore it), send `{ action: 'build' }`. Any other values for action should result in an error. Return the updated castle.
- [ ] If the client requests a non-existent route, a JSON response should be returned to the client.

