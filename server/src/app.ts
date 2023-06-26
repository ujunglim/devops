import express from 'express';
import Debug from './Debug';
import ProcessManager from './ProcessManager';
import cors from 'cors';
import { GetServerList, GetServerListResponse } from './protocol/get/GetServerList';
import { ErrorCode } from './protocol/common/ErrorCode';
import bodyParser from 'body-parser';
import { PostServerAction } from './protocol/post/PostServerAction';
import pm2 from 'pm2';
import { EServerAction } from './Enums';
import fs from 'fs';
import { PostProcessDetail } from './protocol/post/PostProcessDetail';
import { PostLog } from './protocol/post/PostLog';

// SETTING
const PORT = process.env.PORT || 3001;
const app = express();
const pm = new ProcessManager();
const allowedOrigins = ["http://192.168.109.15:3000", "http://localhost:3000"];

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

app.get((new GetServerList()).url(), async (req, res) => {
  const response:GetServerListResponse = {
    processList: await pm.getProcessList(),
    errorcode: ErrorCode.success
  };
  res.status(200).json(response);
})

app.post((new PostServerAction().url()), async (req, res) => {
  const {action, serverName} = req.body;
  pm2[EServerAction[action] as EServerAction](serverName,
    async function (err, apps) {
      if (err) {
        console.error(err);
        return pm2.disconnect();
      }

      const response:GetServerListResponse = {
        processList: await pm.getProcessList(),
        errorcode: ErrorCode.success
      };
      res.status(200).json(response);
    }
  );

})

app.post((new PostProcessDetail().url()), (req, res) => {
  const {name} = req.body;

  // memory
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const reponse = {
        data: JSON.parse(data)[name],
        errorcode: ErrorCode.success
      }
      res.status(200).json(reponse);
    }
  })
})

app.post((new PostLog()).url(), (req, res) => {
  const {name} = req.body;
  // log
  const logFilePath = 'C://Users//Yujung//.pm2//logs//serve-out.log';

  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      return;
    }
    res.status(200).json({
      data: data,
      errorcode: ErrorCode.success
    });
  })
})

async function updateMemoryData () {
  const serverList = pm.processConfigList.map(e => e.name);

  fs.readFile('data.json', 'utf8', async (err, data) => {
    if (err){
      console.log(err);
    } else {
      const memoryData = JSON.parse(data) || {};

      serverList.forEach(async (serverName) => {
        const serverData = await pm.getProcessDescription(serverName);
        const newMemory = Number(((serverData?.monit?.memory || 0) / 1024 / 1024).toFixed(2));
        if (memoryData[serverName]) {
          memoryData[serverName].push(newMemory);
          // max data length is 10
          if (memoryData[serverName].length > 10) {
            memoryData[serverName].shift();
          }
        } else {
          memoryData[serverName] = [newMemory];
        }
        ///// TODO
        if (Object.keys(memoryData).length === serverList.length) {
          fs.writeFileSync('data.json', JSON.stringify(memoryData), 'utf8')
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
