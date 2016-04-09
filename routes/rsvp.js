"use strict";

const express = require('express');
const router = express.Router();
const RethinkdbTable = require('../models/RethinkdbTable');

let rsvpTable = new RethinkdbTable('Rsvp');

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

