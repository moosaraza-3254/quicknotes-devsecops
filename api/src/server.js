const app = require('./app');
const { initDb } = require('./db');

const PORT = Number(process.env.PORT) || 4000;

async function start() {
  let retries = 5;
  while (retries > 0) {
    try {
      await initDb();
      break;
    } catch (err) {
      retries -= 1;
      console.error(
        `DB connection failed, retries left: ${retries}`,
        err.message
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API service listening on port ${PORT}`);
  });
}

start();
