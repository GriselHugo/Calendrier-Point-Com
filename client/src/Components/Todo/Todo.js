import React, { useState, useEffect } from "react";
import expressServer from "../../api/server-express";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Todo() {
    const currentUserId = parseInt(localStorage.getItem("currentUserId"));
    const [todos, setTodos] = useState([]);

    const [action, setAction] = useState("");
    const [status, setStatus] = useState("not done");
    const [selectedDate, setSelectedDate] = useState(null);

    // const [selectedTodo, setSelectedTodo] = useState(null);

    const [modifiedTodoId, setModifiedTodoId] = useState(0);
    const [modifiedAction, setModifiedAction] = useState("");
    const [modifiedStatus, setModifiedStatus] = useState("not done");
    const [modifiedSelectedDate, setModifiedSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleCheckboxChange = () => {
        setStatus((prevStatus) => (prevStatus === "not done" ? "done" : "not done"));
    };

    const handleModifiedCheckboxChange = () => {
        setModifiedStatus((prevStatus) => (prevStatus === "not done" ? "done" : "not done"));
    };

    const handleTodoClick = (todo) => {
        // setSelectedTodo(todo);
        setModifiedTodoId(todo.id);
        setModifiedAction(todo.action);
        setModifiedStatus(todo.status);
        setModifiedSelectedDate(new Date(todo.begin_at));
    };

    useEffect(() => {
        expressServer.getTodosByUser(currentUserId).then((response) => {
            if (response.status === 200) {
                setTodos(response.data);
            } else {
                console.log("Todos not retrieved");
            }
        }).catch((err) => {
            console.error(err);
        });
    }, [currentUserId]);

    function convertISOToDatetime(isoDateString) {
        const date = new Date(isoDateString);
        // Obtenez les composants de la date et de l'heure
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Les mois commencent à 0
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        // Format de la date : 'YYYY-MM-DD HH:mm:ss'
        const datetime = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        return datetime;
    }

    function convertDatimeToText(datetimeString) {
        const date = new Date(datetimeString);
        // Obtenez les composants de la date et de l'heure
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Les mois commencent à 0
        const day = date.getDate();
        // const hours = date.getHours();
        // const minutes = date.getMinutes();
        // const seconds = date.getSeconds();
        // Format de la date : 'DD-MM-YYYY'
        const text = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
        return text;
    }

    const addTodo = () => {
        if (!selectedDate || !action) {
            console.log("Date and action are required");
            return;
        }

        expressServer.addTodo(
            currentUserId,
            action,
            status,
            convertISOToDatetime(selectedDate),
            convertISOToDatetime(selectedDate)
        ).then((response) => {
            if (response.status === 201) {
                setTodos([...todos, response.data[0]]);
                // Réinitialiser les champs après l'ajout
                setAction("");
                setSelectedDate(null);
                setStatus("not done");
            } else {
                console.log("Todo not added");
            }
        }).catch((err) => {
            // Gérer les erreurs ici
            console.error(err);
        });
    };

    const removeTodo = (todoId) => {
        console.log("removeTodo:", todoId);
        expressServer.removeTodo(todoId)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    console.log("Todo removed");
                    const newTodos = todos.filter((todo) => todo.id !== todoId);
                    setTodos(newTodos);
                    setModifiedAction("");
                    setModifiedStatus("not done");
                    setModifiedSelectedDate(null);
                    setModifiedTodoId(null);
                } else {
                    console.log("Todo not removed");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    console.log("Todo not found");
                } else {
                    console.error("An error occurred:", error.message);
                }
            });
    };

    const updateTodo = (todoId, action, status, beginAt, endAt) => {
        console.log("updateTodo:", todoId);
        expressServer.updateTodo(
            todoId,
            action,
            status,
            beginAt,
            endAt
        ).then((response) => {
            console.log(response)
            if (response.status === 200) {
                console.log("Todo updated");
                const newTodos = todos.map((todo) => {
                    if (todo.id === todoId) {
                        return response.data[0];
                    }
                    return todo;
                });
                setTodos(newTodos);
                setModifiedAction("");
                setModifiedStatus("not done");
                setModifiedSelectedDate(null);
                setModifiedTodoId(null);
            } else {
                console.log("Todo not updated");
            }
        }).catch((error) => {
            if (error.response && error.response.status === 404) {
                console.log("Todo not found");
            } else {
                console.error("An error occurred:", error.message);
            }
        });
    };

    return (
        <div>
            <h1>Todo List</h1>

            {/* Formulaire pour ajouter une note */}
            <div>
                <h2>Ajouter une note</h2>
                <div>
                    <label>Sélectionnez une date :</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                <div>
                    <label>Action :</label>
                    <input type="text" value={action} onChange={(e) => setAction(e.target.value)} />
                </div>
                <div>
                    <label>Status :</label>
                    <input type="checkbox" checked={status === "done"} onChange={handleCheckboxChange} />
                </div>
                <button onClick={addTodo}>Ajouter la note</button>
            </div>

            {/* Zone qui affiche toutes les notes */}
            <div>
                <h2>Liste des notes</h2>
                <ul>
                    {todos.map((todo) => (
                        <li key={todo.id} onClick={() => handleTodoClick(todo)}>
                            {todo.action} - {todo.status} - {convertDatimeToText(todo.begin_at)}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Zone qui permet de modifier ou de supprimer les notes */}
            <div>
                <h2>Modifier/Supprimer la note</h2>
                <div>
                    <label>Sélectionnez une date :</label>
                    <DatePicker
                        selected={modifiedSelectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                <div>
                    <label>Action :</label>
                    <input type="text" value={modifiedAction} onChange={(e) => setModifiedAction(e.target.value)} />
                </div>
                <div>
                    <label>Status :</label>
                    <input type="checkbox" checked={modifiedStatus === "done"} onChange={handleModifiedCheckboxChange} />
                </div>
                <button onClick={() => updateTodo(modifiedTodoId, modifiedAction, modifiedStatus, convertISOToDatetime(modifiedSelectedDate), convertISOToDatetime(modifiedSelectedDate))}>Modifier la note</button>
                <button onClick={() => removeTodo(modifiedTodoId)}>Supprimer la note</button>
            </div>
        </div>
    );
}

export default Todo;
