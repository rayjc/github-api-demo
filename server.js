const app = require("./app");
const { APP_PORT } = require("./config");

app.listen(APP_PORT, function() {
  console.log(`Listening on http://localhost:${APP_PORT}`);
});