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
import moment from 'moment';
const MAX_DATA_COUNT = 10;

// SETTING
const PORT = process.env.PORT || 3001;
const app = express();
const pm = new ProcessManager();
const allowedOrigins = ["http://192.168.108.71:3000", "http://localhost:3000"];

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
      const parsedData = JSON.parse(data);
      const reponse = {
        date: parsedData.date || [],
        data: parsedData.data[name] || [],
        errorcode: ErrorCode.success
      }
      res.status(200).json(reponse);
    }
  })
})

// convert string logs ➡ arr logs
const getLogArr: string[] = (log: any) => {
  const logArr = log.split('\n');
  // 마지막에 빈 문자열 제거
  if (logArr[logArr.length-1] === '') {
    logArr.pop();
  }
  return logArr;
}

const getLogs = (name: string) => {
  const logs: any = {};
  const logOutStr = fs.readFileSync(`C://Users//Yujung//.pm2//logs//${name}-out.log`, 'utf8');
  const logErrStr = fs.readFileSync(`C://Users//Yujung//.pm2//logs//${name}-error.log`, 'utf8');

  const logOutArr = getLogArr(logOutStr);
  const logErrArr = getLogArr(logErrStr);
  
  // get out logs
  for (const logOutElement of logOutArr) {
    const [date, out] = logOutElement.split(': ');
    const isoString = moment(date).toISOString();
    const timestamp = new Date(isoString).getTime();
    logs[timestamp] = out;
  }
  // get error logs
  for (const logErrElement of logErrArr) {
    const [date, out] = logErrElement.split(': ');
    const isoString = moment(date).toISOString();
    const timestamp = new Date(isoString).getTime();
    logs[timestamp] = out;
  }
  return logs;
}

app.post((new PostLog()).url(), (req, res) => {
  const {name} = req.body;
  const logs = getLogs(name);

  // sort logs by timestamp
  const newLogs: any = {};
  Object.keys(logs).sort((a, b) => parseInt(a) - parseInt(b)).forEach(i => newLogs[i] = logs[i])

  const finalLog = [];
  for (const [date, log] of Object.entries(newLogs)) {
    finalLog.push({
      date,
      log,
    });
  }
  res.status(200).json({
    data: finalLog,
    errorcode: ErrorCode.success
  })
})

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
