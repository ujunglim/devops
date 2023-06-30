import express from 'express';
import Debug from './Debug';
import ProcessManager from './ProcessManager';
import cors from 'cors';
import { ErrorCode } from './protocol/common/ErrorCode';
import bodyParser from 'body-parser';
import fs from 'fs';
import moment from 'moment';
import authRouter from './routes/auth';
import serverRouter from './routes/server';
const MAX_DATA_COUNT = 10;

// =========== CONFIGURATIONS ===========
const PORT = process.env.PORT || 3001;
const app = express();
export const pm = new ProcessManager();
const allowedOrigins = ["http://192.168.108.11:3000", "http://localhost:3000"];

// ============= MIDDLEWARES =============
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(
  cors({
    origin: function (origin: any, callback: any) {
      // console.log(origin, allowedOrigins)
      if (allowedOrigins.includes(origin) || origin === undefined) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// get local server ip
app.get('/ip', async (req, res) => {
  const ip = req.socket.remoteAddress;
  res.status(200).json({
    ip: ip?.split('::ffff:')[1] + ':' + PORT,
    errorcode: ErrorCode.success
  })
})

// =============== ROUTES ==============
app.use('/auth', authRouter);
app.use('/server', serverRouter);

async function updateMemoryData () {
  const serverList = pm.processConfigList.map(e => e.name);
  let nowDate: string = moment(new Date()).format('HH:mm:ss');

  fs.readFile('data.json', 'utf8', async (err, data) => {
    if (err){
      console.log(err);
    } else {
      const memory = data ? JSON.parse(data) : {data: {}};
      const memoryData = memory.data;

      // save memory date
      if (!memory.date) {
        memory.date = [nowDate];
      } else {
        memory.date.push(nowDate);
        if (memory.date.length > MAX_DATA_COUNT) {
          memory.date.shift();
        }
      }

      // save memory data
      serverList.forEach(async (serverName) => {
        const serverData = await pm.getProcessDescription(serverName);
        const newData = Number(((serverData?.monit?.memory || 0) / 1024 / 1024).toFixed(2));
        if (memoryData[serverName]) {
          memoryData[serverName].push(newData);
          if (memoryData[serverName].length > MAX_DATA_COUNT) {
            memoryData[serverName].shift();
          }
        } else {
          memoryData[serverName] = [newData];
        }
        // write back new memory data
        if (Object.keys(memoryData).length === serverList.length) {
          fs.writeFileSync('data.json', JSON.stringify(memory), 'utf8')
        }
      })
  }});
}

// INIT
async function init () {
  await pm.loadProcessConfigJSON('configs/pm2.config.json');

  setInterval(() => {
    updateMemoryData(); // graph memory data
  }, 2000)

  app.listen(PORT, () => {
    Debug.log(`Server Listening on :${PORT}`);
  });
}

init();
