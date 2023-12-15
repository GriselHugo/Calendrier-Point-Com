const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { json } = require('body-parser');

/* Sign Up */

function processSignUp({ res, username, password }) {
    const db = require('../database-config');

    const query = 'INSERT INTO users (name, password, created_at, updated_at) VALUES (?, ?, NOW(), NOW())';
    const selectQuery = 'SELECT * FROM users WHERE name = ?';

    const key = process.env.HASH_KEY;

    const hash = crypto.createHmac('sha256', key);
    hash.update(password);

    const hashedPassword = hash.digest('hex');

    db.query(query, [username, hashedPassword], (error, results) => {
        if (error) {
            res.status(500).send('Error creating user');
            return;
        }

        // console.log(results);
        db.query(selectQuery, [username], (error, userResults) => {
            if (error) {
                res.status(500).send('Error retrieving user data');
                return;
            }

            res.status(201).json(userResults);
        });
    });
}

function signUp({ res, username, password }) {
    const db = require('../database-config');

    const query = 'SELECT * FROM users WHERE name = ?';

    db.query(query, [username], (error, results) => {
        if (error) {
            console.log("Erreur :", error);
            res.status(500).send('Error checking user existence');
            return;
        }

        if (results.length > 0) {
            res.status(200).send('User already exists');
            return;
        }

        processSignUp({ res, username, password });
    });
}

router.post('/sign-up', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send('Missing username or password');
        return;
    }

    signUp({ res, username, password });
});

/* Log In */

function logIn({ res, username, password }) {
    const db = require('../database-config');

    const key = process.env.HASH_KEY;

    const hash = crypto.createHmac('sha256', key);
    hash.update(password);

    const hashedPassword = hash.digest('hex');

    const query = 'SELECT * FROM users WHERE name = ? AND password = ?';

    db.query(query, [username, hashedPassword], (error, results) => {
        if (error) {
            res.status(500).send('Error logging in');
            return;
        }

        if (results.length > 0) {
            // console.log(results);
            res.status(200).json(results);
            return;
        }

        res.status(400).send('No user found');
    });
}

router.post('/log-in', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send('Missing username or password');
        return;
    }

    logIn({ res, username, password });
});

module.exports = router;
