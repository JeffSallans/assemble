"use strict";

const express = require('express');
const router = express.Router();
const RethinkdbTable = require('../nodeOnlyModels/RethinkdbTable');

var rsvpTable = new RethinkdbTable('Rsvps');

router.get('/', (req, res, next) => {

    rsvpTable.getAll(req, res, next);
});
router.put('/', (req, res, next) => {

    rsvpTable.update(req, res, next);
});
router.delete('/', (req, res, next) => {

    rsvpTable.delete(req, res, next);
});

module.exports = router;

