//index.js

const port = 4000;
const app = require('./app-config');

app.listen(4000, () => {
  console.log(`server listening on port ${port}`);
});
