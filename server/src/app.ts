import express from 'express';
import Debug from './Debug';
import ProcessManager from './ProcessManager';
import cors from 'cors';

// SETTING
const PORT = process.env.PORT || 3001;
const app = express();
const pm = new ProcessManager();
const allowedOrigins = ["http://192.168.199.158:3000", "http://localhost:3000"];

app.use(express.static('public'));
app.use(
  cors({
    origin: function (origin: any, callback: any) {
      console.log(origin, allowedOrigins)
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.get("/server-list", async (req, res) => {
  const processList = await pm.getProcessList();
  res.status(200).json(processList);
})

app.post('/server-list', async (req, res) => {

  const {action, } = req;
})

// INIT
async function init () {
  await pm.loadProcessConfigJSON('configs/pm2.config.json');
  app.listen(PORT, () => {
    Debug.log(`Server Listening on :${PORT}`);
  });
}

init();
