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

// SETTING
const PORT = process.env.PORT || 3001;
const app = express();
const pm = new ProcessManager();
const allowedOrigins = ["http://192.168.45.59:3000", "http://localhost:3000"];

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

async function updateMemoryData () {
  const serverList = pm.processConfigList.map(e => e.name);

  fs.readFile('data.json', 'utf8', async (err, data) => {
    if (err){
      console.log(err);
    } else {
      const oldData = JSON.parse(data);

      serverList.forEach(async (serverName) => {
        const serverData = await pm.getProcessDescription(serverName);
        const newMemory = Number((serverData?.monit?.memory / 1024 / 1024).toFixed(2));
        if (oldData[serverName]) {
          oldData[serverName].push(newMemory);
          // max data length is 10
          if (oldData[serverName].length > 10) {
            oldData[serverName].shift();
          }
        } else {
          oldData[serverName] = [newMemory];
        }
        ///// TODO
        if (Object.keys(oldData).length === serverList.length) {
          fs.writeFile('data.json', JSON.stringify(oldData), 'utf8', () => console.log('Finished writing'))
        }
      })
  }});
}

// INIT
async function init () {
  await pm.loadProcessConfigJSON('configs/pm2.config.json');

  setInterval(() => {
    updateMemoryData();
  }, 2000)

  app.listen(PORT, () => {
    Debug.log(`Server Listening on :${PORT}`);
  });
}

init();
