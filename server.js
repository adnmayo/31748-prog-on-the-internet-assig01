const createApp = require("./src/app");
const { createDbConnection, connectDb } = require("./src/db/connection");

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const db = createDbConnection();

  try {
    await connectDb(db);
    console.log("Connected to MySQL database.");
  } catch (err) {
    console.error("Could not connect to MySQL:", err.message);
    process.exit(1);
  }

  const app = createApp(db);
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
