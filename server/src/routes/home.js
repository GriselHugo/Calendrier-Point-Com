const express = require('express');
const router = express.Router();

/* Get users */

router.get('/get-users', (req, res) => {
  const db = require('../database-config');

  const query = 'SELECT * FROM users';

  db.query(query, (error, results) => {
    if (error) {
      res.status(500).send('Error getting users');
      return;
    }

    res.status(200).send(results);
  });
});

module.exports = router;
