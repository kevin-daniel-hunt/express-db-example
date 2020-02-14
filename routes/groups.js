const router = require('express').Router();
const url = require('url');
const db = require('../util/db');

async function getGroups(userId) {
  let groups;
  try {
    groups = await db.any('SELECT g.name as groupname, g.id as groupid, e.email, u.name as username FROM groups AS g LEFT JOIN groups_to_emails AS e ON g.id = e.groupid LEFT JOIN users AS u ON u.email = e.email WHERE g.owner=${userId} ORDER BY g.created', {
      userId,
    });
  } catch (err) {
    throw err;
  }
  const uniqueGroups = groups.map(g => ({ name: g.groupname, id: g.groupid, members: [] })).filter((g, i, arr) => arr.findIndex((f) => f.id === g.id) === i);

  uniqueGroups.forEach(u => {
    groups.filter(g => u.id === g.groupid).forEach((g) => {
      if (g.email) {
        u.members.push({
          email: g.email,
          name: g.username
        });
      }
    });
  });
  return uniqueGroups
}

router.get('/', async (req, res) => {
  let groups;
  try {
    groups = await getGroups(req.jwt.userId);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
  res.send(groups);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    if (req.jwt.api) {
      res.sendStatus(400);
    } else {
      res.redirect(url.format({
        pathname: '/dashboard',
        query: {
          error: 'Name must be provided',
        },
      }));
    }
    return;
  }
  try {
    await db.none('INSERT INTO groups (name, owner) VALUES (${name}, ${userId})', {
      name,
      userId: req.jwt.userId,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  }
  if (req.jwt.api) {
    res.sendStatus(200);
    return;
  }
  res.redirect('/dashboard');
});

router.post('/:id/users', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    if (req.jwt.api) {
      res.sendStatus(400);
    } else {
      res.redirect(url.format({
        pathname: '/dashboard',
        query: {
          error: 'Email must be provided',
        },
      }));
    }
    return;
  }
  try {
    await db.none('INSERT INTO groups_to_emails (groupid, email) VALUES (${id}, ${email})', {
      id: parseInt(req.params.id, 10),
      email,
    });
  } catch (err) {
    console.error(err);
    if (err.code = '23505') {
      if (req.jwt.api) {
        res.sendStatus(400);
      } else {
        res.redirect(url.format({
          pathname: '/dashboard',
          query: {
            error: 'User already exists in group',
          },
        }));
      }
    }
    res.sendStatus(500);
    return
  }
  if (req.jwt.api) {
    res.sendStatus(200);
    return;
  }
  res.redirect('/dashboard');
});

module.exports = router;
module.exports.getGroups = getGroups;