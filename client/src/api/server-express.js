import axios from 'axios';

class Server {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:4000/',
    });
  }

    ping() {
        return this.api.get('/');
    }

    async apiCall() {
        const data = await this.api.get('/');
      console.log(data);
    }

    /* LOGIN */

    signUp(username, password) {
      return this.api.post('/sign-up',
        {
          username: username,
          password: password,
        },
      );
    }

    logIn(username, password) {
      return this.api.post('/log-in',
        {
          username: username,
          password: password,
        },
      );
    }

    /* PROFILE */

    changePassword(username, oldPassword, newPassword) {
      return this.api.post('/change-password',
        {
          username: username,
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
      );
    }

    changeUsername(oldUsername, newUsername) {
      return this.api.post('/change-username',
        {
          oldUsername: oldUsername,
          newUsername: newUsername,
        },
      );
    }

    getUser(id) {
      return this.api.get('/get-user',
        {
          params: {
            id: id,
          },
        },
      );
    }

    /* HOME */

    getUsers() {
      return this.api.get('/get-users');
    }

    /* TODO */

    addTodo(userId, action, status, beginAt, endAt) {
      return this.api.post('/add-todo',
        {
          userId: userId,
          action: action,
          status: status,
          beginAt: beginAt,
          endAt: endAt,
        },
      );
    }

    removeTodo (todoId) {
      return this.api.post('/remove-todo',
        {
          todoId: todoId,
        },
      );
    }

    updateTodo (todoId, action, status, beginAt, endAt) {
      return this.api.post('/update-todo',
        {
          todoId: todoId,
          action: action,
          status: status,
          beginAt: beginAt,
          endAt: endAt,
        },
      );
    }

    getTodosByUser (userId) {
      return this.api.get('/get-todos-by-user',
        {
          params: {
            userId: userId,
          },
        },
      );
    }
}

const expressServer = new Server();
export default expressServer;
