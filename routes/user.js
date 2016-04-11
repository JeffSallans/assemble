"use strict";

const express = require('express');
const router = express.Router();
const RethinkdbTable = require('../nodeOnlyModels/RethinkdbTable');

var userTable = new RethinkdbTable('Users');

router.get('/', (req, res, next) => {

    userTable.getAll(req, res, next);
});
router.put('/', (req, res, next) => {

    userTable.update(req, res, next);
});
router.delete('/', (req, res, next) => {

    userTable.delete(req, res, next);
});

module.exports = router;