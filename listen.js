const { PORT } = process.env;
const app = require("./app/app");

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
