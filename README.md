# Mean Stack Presentation

Presentation for MEAN Stack for Michigan Hackers.

# [Presentation](http://xby2.github.io/mean-stack-presentation)

How to setup a MEAN Stack Application from scratch

# Install Process

NOTE: This is for Windows

System specs: Window 8.1, Windows 7


## [Install Git Bash with (minGW)](http://git-scm.com)

For version control and a terminal with a few linux terminal commands

https://git-scm.com/download/win

## [Install Node.js](http://nodejs.org/download)

http://nodejs.org/download

I used https://nodejs.org/dist/v4.2.2/node-v4.2.2-x64.msi

To Test
```
$ node -v
//Expected v#.#.#
```

## [Install MongoDB](https://www.mongodb.org/downloads#production)

https://www.mongodb.org/downloads

Install at C:\mongodb

To Test
```
$ C:\mongodb\Server\3.0\bin\mongod.exe -v
//Expected
```

## [Install Python 2.7](https://www.python.org/downloads/release/python-2710)

https://www.python.org/downloads/release/python-2710

Add to path variable
*make sure to press all OKs and restart Git Bash

```bash
set PATH=%PATH%;C:\my_python_lib
```

To Test
```
$ python -v
//Expected
```

## Retrive all code and libraries packages

```
//Get code from repository
$ git clone https://github.com/xby2/mean-stack-presentation.git
//Navigate to application root
$ cd mean-stack-presentation/example-site/peanut-gallery
//This installs all the packages listed in package.json
$ npm install
```

# Start Mongo

Create the default DB directory (if it does not exist)
```
$ mkdir -p C:/data/db
```

Start Mongo DB
```
$ C:\mongodb\Server\3.0\bin\mongod.exe
```

Setup Mongo Database
```
//Client side terminal for modifying mongodb
$ C:\mongodb\Server\3.0\bin\mongo.exe
//Create database peanutgallery
> use peanutgallery
```

The following should appear on the last line in the console:
```
$ I NETWORK [initandlisten] waiting for connections on port 27017
```

[Read more](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows)

# Start Application

Navigate to peanut-gallery folder
```
//Actual command is node ./bin/www
//npm start defined in package.json
$ npm start
```

View application at [localhost:3000](http://localhost:3000)

# Contributors

[Mohammed Hussain](https://github.com/mhhussain)
[Dave Farinelli](http://github.com/davefarinelli)
[Jeff Sallans](https://github.com/JeffSallans)