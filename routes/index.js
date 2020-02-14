const router = require('express').Router();
const url = require('url');
const login = require('./login');
const groups = require('./groups');
const { getGroups } = require('./groups');
const { verifyJWT } = require('../util');

async function verifyToken(req, res, next) {
  let error, payload;
  if (!req.cookies.jwt) {
    error = "Please login";
  } else {
    try {
      payload = await verifyJWT(req.cookies.jwt);
      req.jwt = payload;
    } catch (err) {
      error = "Please login";
    }
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
  next();
}

router.use(login);

router.use(verifyToken);

router.get('/dashboard', async (req, res) => {
  let groups;
  try {
    groups = await getGroups(req.jwt.userId);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
  res.render('dashboard', { name: req.jwt.name, groups, error: req.query.error });
});
router.use('/groups', groups);

module.exports = router;