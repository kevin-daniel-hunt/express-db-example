const router = require('express').Router();
const url = require('url');
const { generateRandomBytes, generateHash, signJWT } = require('../util');
const db = require('../util/db');

router.get('/', (req, res) => {
  res.render('index', { error: req.query.error });
});
router.get('/login', (req, res) => {
  res.render('login', { error: req.query.error });
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let error;
  if (!email || !password) {
    error = 'All fields must be present';
  }
  if (error) {
    res.redirect(url.format({
      pathname: '/login',
      query: {
        error,
      },
    }));
    return;
  }
  let data;
  try {
    data = await db.one('SELECT id, name, hash, salt FROM users WHERE email=${email}', {
      email,
    });
    console.log('DB DATA: ', data);
  } catch (err) {
    if (err.name === 'QueryResultError' && err.code === 0) {
      res.redirect(url.format({
        pathname: '/login',
        query: {
          error: 'Email not found, consider signing up.',
        },
      }));
    } else {
      console.error(err);
      res.sendStatus(500);
    }
    return;
  }
  let key;
  try {
    key = await generateHash(password, data.salt);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
  if (key !== data.hash) {
    res.redirect(url.format({
      pathname: '/login',
      query: {
        error: 'Password invalid',
      },
    }));
    return;
  }
  let token;
  try {
    token = await signJWT({ userId: data.id, name: data.name, api: false });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
  res.cookie('jwt', token);
  res.redirect('/dashboard');
});
router.post('/users', async (req, res) => {
  const { password, email, name } = req.body;
  let error;
  if (!email || !password || !name) {
    error = 'All fields must be present';
  } else if (email.indexOf('@') < 1 || email.indexOf('@') === (email.length - 1)) {
    error = 'Invalid email';
  }
  if (error) {
    res.redirect(url.format({
      pathname: '/',
      query: {
        error,
      },
    }));
    return;
  }
  let salt, key;
  try {
    salt = await generateRandomBytes(16);
    key = await generateHash(password, salt);
  } catch (err) {
    console.err(err);
    res.sendStatus(500);
    return;
  }
  try {
    await db.none('INSERT INTO users (email, name, hash, salt) VALUES (${email}, ${name}, ${key}, ${salt})', {
      email,
      name,
      key,
      salt,
    });
  } catch (err) {
    console.error(err);
    if (err.code = '23505') {
      res.redirect(url.format({
        pathname: '/',
        query: {
          error: 'Email already exists',
        },
      }));
    } else {
      res.sendStatus(500);
    }
    return;
  }
  res.redirect('/login');
});


module.exports = router;