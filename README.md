# Assemble

Full stack web application (Angular, Web Sockets, Sockets.io, Express.js, Node.js, rethinkdb, PushBullet API) For sending out a text message to play rocket league and tracking the responses.

## [Demo](http://assemble.jeffsallans.com)

## Technology

* Angular (using ES6)
  * [angular-socket-io](https://github.com/btford/angular-socket-io)
* Node.js (using ES6)
* NPM modules
  * Express
  * [Rethinkdb](https://rethinkdb.com)
  * [Sockets.io](http://socket.io/download/)
* [Push Bullet API](https://docs.pushbullet.com/#send-sms)

## Install

1) Pull this repository

2) Download and setup rethinkdb (https://www.rethinkdb.com/)

3) Install all npm modules
```
$ npm install
```
4) Manually install pushbullet dependent modules (Because the push bullet api on GitHub is more up-to-date than npm; npm doesn't have Ephemerals)
```
$ npm install pushbullet
```

5) Create secret/pushBulletApiToken.js that returns the API key

## Deployment

1) Run rethinkdb.exe

2) Navigate to project directory
```
//npm start defined in package.json
//Actual command is node --harmony ./bin/www
//Harmony flag enables staged ES6 features
$ npm start
```

3) View application at [localhost:3000](http://localhost:3000)

## Conventions

* CSS - BEM (https://css-tricks.com/bem-101/)
* Angular - John Papa's Guide (https://github.com/johnpapa/angular-styleguide)

## Take Aways

* Rethink node module library requires more work than mongodb
  * Creating tables and db if they don't exists is a pain
* [Postman](https://www.getpostman.com/) is easy for development testing and you can save your tests in a suite
* [Iron Node](http://s-a.github.io/iron-node/) is great for debugging node applications
  * Easy to setup and learn
  * Uses chrome debugger
* Frontend and backend model sharing is not easy.  One uses require and the other use html to include files

## To Do

- [x] POST /Poll (Starts the process to poll the users)
- [x] Push Bullet API send texts (https://docs.pushbullet.com/#send-sms)
- [x] GET /Rsvp (Returns data about the user's reponse)
- [x] POST /Rsvp (Updates data about the user's reponse)
- [x] GET /User (Returns a list of registered users)
- [x] Frontend - Display user list
- [x] Frontend - Poll action
- [x] Frontend - Display rsvp details on load
- [x] Web Sockets emit messages when Rsvp is updated on the backend
- [x] Frontend - Web socket rsvp details
- [x] POST /User (Adds a new user/Updates existing user)
- [x] DELETE /User/{id} (Removes a user)
- [x] Frontend - Manage user list
- [ ] Frontend Polish - CSS, Animations
- [ ] Frontend - mobile friendly
- [x] DELETE /Poll (Resets the polling process)

## Contributors

[Jeff Sallans](https://github.com/JeffSallans)