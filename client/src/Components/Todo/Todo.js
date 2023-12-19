import React, { useState, useEffect } from "react";
import expressServer from "../../api/server-express";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Todo() {
    const currentUserId = parseInt(localStorage.getItem("currentUserId"));
    const [todos, setTodos] = useState();
    const [compteur, setCompteur] = useState(0);
    const [action, setAction] = useState("");
    const [status, setStatus] = useState("not done");

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleCheckboxChange = () => {
        setStatus((prevStatus) => (prevStatus === "not done" ? "done" : "not done"));
      };

    useEffect(() => {
        expressServer.getTodosByUser(currentUserId).then((response) => {
            console.log(response)
            if (response.status === 200) {
                console.log("Todos retrieved");
                console.log(response.data);
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

    const addTodo = () => {
        console.log("addTodo");
        console.log(action)
        console.log(status)
        console.log(selectedDate)
        console.log(convertISOToDatetime(selectedDate))

        if (!selectedDate) {
            console.log("No date selected");
            return;
        }

        if (!action) {
            console.log("No action");
            return;
        }

        expressServer.addTodo(
            currentUserId,
            action,
            status,
            convertISOToDatetime(selectedDate),
            convertISOToDatetime(selectedDate)
        ).then((response) => {
            console.log(response)
            if (response.status === 201) {
                console.log("Todo added");
                setTodos([...todos, response.data[0]]);
            } else {
                console.log("Todo not added");
            }
        }).catch((err) => {
            if (err.response && err.response.status === 404) {
                console.log("User not found");
            } else if (err.response && err.response.status === 500) {
                console.log("Error adding todo");
            }
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
        C'est la todo

        <div className="todoContainer" onClick={() => {addTodo()}}>add todo</div>
        <div className="todoContainer" onClick={() => {console.log("Todos :", todos)}}>get todos</div>
        <div className="todoContainer" onClick={() => {setCompteur(compteur + 1); console.log(compteur + 1)}}>up compteur</div>
        <div className="todoContainer" onClick={() => {setCompteur(compteur - 1); console.log(compteur - 1)}}>down compteur</div>
        <div className="todoContainer" onClick={() => {removeTodo(compteur)}}>remove todo</div>
        <div className="todoContainer" onClick={() => {updateTodo(compteur, action, status, convertISOToDatetime(selectedDate), convertISOToDatetime(selectedDate))}}>update todo</div>
        <div>{compteur}</div>
        <div></div>
        <div>
          <label>Sélectionnez un jour :</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div></div>
        <label>Action :</label>
        <input type="text" value={action} onChange={(e) => setAction(e.target.value)} />
        <div></div>
        <label>Status :</label>
        <input type="checkbox" checked={status === "done"} onChange={handleCheckboxChange} />

    </div>
    );
}

export default Todo;
