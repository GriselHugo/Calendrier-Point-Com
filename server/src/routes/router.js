const express = require('express');
const router = express.Router();

const loginRoutes = require('./login');
const homeRoutes = require('./home');
const profilRoutes = require('./profil');

router.use('/', loginRoutes);
router.use('/', homeRoutes);
router.use('/', profilRoutes);

router.get('/', (req, res) => {
  res.send('Server is up and running !');
});

module.exports = router;