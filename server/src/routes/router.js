const express = require('express');
const router = express.Router();

const loginRoutes = require('./login');

router.use('/', loginRoutes);

router.get('/', (req, res) => {
  res.send('Server is up and running !');
});

module.exports = router;