const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { secret } = require('../config');

const HASH_ITERATIONS = 1000;
const HASH_LENGTH = 32;
const HASH_DIGEST = 'sha256';

function generateRandomBytes(bytes) {
  return new Promise((res, rej) => {
    crypto.randomBytes(bytes, (err, buf) => {
      if (err) rej(err);
      else res(buf.toString('hex'));
    });
  })
}

function generateHash(password, salt) {
  return new Promise((res, rej) => {
    crypto.pbkdf2(password, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_DIGEST, (err, key) => {
      if (err) rej(err);
      else res(key.toString('hex'));
    })
  })
}

function signJWT(payload) {
  return new Promise((res, rej) => {
    jwt.sign(payload, secret, (err, token) => {
      if (err) rej(err);
      else res(token);
    });
  });
}

function verifyJWT(token) {
  return new Promise((res, rej) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) rej(err);
      else res(decoded);
    });
  });
}

exports.HASH_ITERATIONS = HASH_ITERATIONS;
exports.HASH_LENGTH = HASH_LENGTH;
exports.HASH_DIGEST = HASH_DIGEST;
exports.generateRandomBytes = generateRandomBytes;
exports.generateHash = generateHash;
exports.signJWT = signJWT;
exports.verifyJWT = verifyJWT;