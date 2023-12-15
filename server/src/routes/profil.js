const express = require('express');
const router = express.Router();
const crypto = require('crypto');

/* Change password */

function changePassword({ res, username, oldPassword, newPassword }) {
  const db = require('../database-config');

  const query = 'SELECT * FROM users WHERE name = ?';

  db.query(query, [username], (error, results) => {
    if (error) {
      res.status(500).send('Error checking user existence');
      return;
    }

    if (results.length === 0) {
      res.status(500).send('User does not exist');
      return;
    }

    const key = process.env.HASH_KEY;

    const hash = crypto.createHmac('sha256', key);
    hash.update(oldPassword);

    const hashedPassword = hash.digest('hex');

    if (hashedPassword !== results[0].password) {
      res.status(400).send('Wrong password');
      return;
    }

    const hash2 = crypto.createHmac('sha256', key);
    hash2.update(newPassword);

    const hashedPassword2 = hash2.digest('hex');

    const query2 = 'UPDATE users SET password = ? WHERE name = ?';

    db.query(query2, [hashedPassword2, username], (error, results) => {
        if (error) {
          res.status(500).send('Error updating password');
          return;
        }

        res.status(200).send('Password updated');
    });
  });
}

router.post('/change-password', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
      res.status(400).send('Missing username or password');
      return;
  }

  if (oldPassword === newPassword) {
      res.status(400).send('New password must be different from old password');
      return;
  }

  changePassword({ res, username, oldPassword, newPassword });
});

/* Change username */

function changeUsername({ res, oldUsername, newUsername }) {
  const db = require('../database-config');

  const query = 'SELECT * FROM users WHERE name = ?';

  db.query(query, [oldUsername], (error, results) => {
    if (error) {
      res.status(500).send('Error checking user existence');
      return;
    }

    if (results.length === 0) {
      res.status(500).send('User does not exist');
      return;
    }

    const query2 = 'UPDATE users SET name = ? WHERE name = ?';

    db.query(query2, [newUsername, oldUsername], (error, results) => {
        if (error) {
          res.status(500).send('Error updating username');
          return;
        }

        res.status(200).send('Username updated');
    });
  });
}

router.post('/change-username', (req, res) => {
  const { oldUsername, newUsername } = req.body;

  if (!oldUsername || !newUsername) {
      res.status(400).send('Missing username');
      return;
  }

  if (oldUsername === newUsername) {
      res.status(400).send('New username must be different from old username');
      return;
  }

  changeUsername({ res, oldUsername, newUsername });
});

/* Get user */

router.get('/get-user', (req, res) => {
  const db = require('../database-config');

  const id = req.query.id;

  const query = 'SELECT * FROM users WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send('Error getting user');
      return;
    }

    res.status(200).json(results);
  });
});

module.exports = router;
