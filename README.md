# Assemble

Full stack web application (Angular, Web Sockets, Sockets.io, Express.js, Node.js, rethinkdb, PushBullet API) For sending out a text message to play rocket league and tracking the responses.

## [Demo](http://assemble.jeffsallans.com)

## Install Process

* Angular (using ES6)
* Node.js (using ES6)
* NPM modules
  * Express
  * Rethinkdb
  * Sockets.io
* Push Bullet API (https://docs.pushbullet.com/#send-sms)

## Deployment

Run rethinkdb.exe

Navigate to project directory
```
//Actual command is node ./bin/www
//npm start defined in package.json
$ npm start
```

View application at [localhost:3000](http://localhost:3000)

## Conventions

* CSS - BEM (https://css-tricks.com/bem-101/)
* Angular - John Papa's Guide (https://github.com/johnpapa/angular-styleguide)

## To Do

- [x] POST /Poll (Starts the process to poll the users)
- [x] Push Bullet API send texts (https://docs.pushbullet.com/#send-sms)
- [ ] GET /User/{id}/Rsvp (Returns data about the user's reponse)
- [ ] POST /User/{id}/Rsvp (Updates data about the user's reponse)
- [x] GET /User (Returns a list of registered users)
- [ ] Frontend - Display user list
- [ ] Frontend - Poll action
- [ ] Frontend - Display rsvp details on load
- [ ] Web Sockets emit messages when Rsvp is updated on the backend
- [ ] Frontend - Web socket rsvp details
- [x] POST /User (Adds a new user/Updates existing user)
- [x] DELETE /User/{id} (Removes a user)
- [ ] Frontend - Manage user list
- [ ] Frontend Polish - CSS, Animations
- [ ] Frontend - mobile friendly
- [ ] DELETE /Poll (Resets the polling process)

## Contributors

[Jeff Sallans](https://github.com/JeffSallans)