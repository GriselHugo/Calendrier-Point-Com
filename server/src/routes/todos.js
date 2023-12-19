const express = require('express');
const router = express.Router();

/* Add Todo */

function addTodo ({ res, userId, action, status, beginAt, endAt }) {
    const db = require('../database-config');

    const query = 'INSERT INTO todo (user_id, action, status, begin_at, end_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
    const selectQuery = 'SELECT * FROM todo WHERE user_id = ? AND action = ? AND status = ? AND begin_at = ? AND end_at = ?';

    db.query(query, [userId, action, status, beginAt, endAt], (error, results) => {
        if (error) {
            res.status(500).send('Error creating todo');
            return;
        }

        db.query(selectQuery, [userId, action, status, beginAt, endAt], (error, todoResults) => {
            if (error) {
                res.status(500).send('Error retrieving todo data');
                return;
            }

            res.status(201).json(todoResults);
        });
    });
}

router.post('/add-todo', (req, res) => {
    const { userId, action, status, beginAt, endAt } = req.body;

    const db = require('../database-config');

    const query = 'SELECT * FROM todo WHERE user_id = ? AND action = ? AND status = ? AND begin_at = ? AND end_at = ?';

    db.query(query, [userId, action, status, beginAt, endAt], (error, results) => {
        if (error) {
            res.status(500).send('Error checking todo existence');
            return;
        }

        if (results.length > 0) {
            res.status(200).send('Todo already exists');
            return;
        }

        addTodo ({ res, userId, action, status, beginAt, endAt });
    });
});

/* Remove Todo */

function removeTodo ({ res, todoId }) {
    const db = require('../database-config');

    const query = 'DELETE FROM todo WHERE id = ?';

    db.query(query, [todoId], (error, results) => {
        if (error) {
            res.status(500).send('Error deleting todo');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('Todo not found');
            return;
        }

        res.status(200).send('Todo deleted');
    });
}

router.post('/remove-todo', (req, res) => {
    const { todoId } = req.body;

    removeTodo ({ res, todoId });
});

/* Update Todo */

function updateTodo ({ res, todoId, action, status, beginAt, endAt }) {
    const db = require('../database-config');

    const query = 'UPDATE todo SET action = ?, status = ?, begin_at = ?, end_at = ?, updated_at = NOW() WHERE id = ?';

    db.query(query, [action, status, beginAt, endAt, todoId], (error, results) => {
        if (error) {
            res.status(500).send('Error updating todo');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('Todo not found');
            return;
        }

        const selectQuery = 'SELECT * FROM todo WHERE id = ?';

        db.query(selectQuery, [todoId], (error, todoResults) => {
            if (error) {
                res.status(500).send('Error retrieving todo data');
                return;
            }

            res.status(200).json(todoResults);
        });
    });
}

router.post('/update-todo', (req, res) => {
    const { todoId, action, status, beginAt, endAt } = req.body;

    updateTodo ({ res, todoId, action, status, beginAt, endAt });
});

/* Get Todos by User */

function getTodosByUser ({ res, userId }) {
    const db = require('../database-config');

    // console.log("2userId:", userId);

    const query = 'SELECT * FROM todo WHERE user_id = ?';

    db.query(query, [userId], (error, results) => {
        if (error) {
            res.status(500).send('Error retrieving todos');
            return;
        }

        res.status(200).send(results);
    });
}

router.get('/get-todos-by-user', (req, res) => {
    const { userId } = req.query;
    // console.log("userId:", userId);

    getTodosByUser ({ res, userId });
});

module.exports = router;