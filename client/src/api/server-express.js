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
}

const expressServer = new Server();
export default expressServer;
