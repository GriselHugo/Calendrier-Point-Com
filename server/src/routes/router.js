const express = require('express');
const router = express.Router();

const loginRoutes = require('./login');
const profilRoutes = require('./profil');

router.use('/', loginRoutes);
router.use('/', profilRoutes);

router.get('/', (req, res) => {
  res.send('Server is up and running !');
});

module.exports = router;