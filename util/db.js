const pgp = require('pg-promise')();

const { dbConnection } = require('../config');

const db = pgp(dbConnection);

module.exports = db;