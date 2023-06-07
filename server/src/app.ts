import express from 'express';
import Debug from './Debug';
import ProcessManager from './ProcessManager';
import cors from 'cors';
import { GetServerList, GetServerListResponse } from './protocol/get/GetServerList';
import { ErrorCode } from './protocol/common/ErrorCode';
import GetSum, { GetSumResponse } from './protocol/get/GetSum';
import PostSum from './protocol/post/PostSum';
import bodyParser from 'body-parser';
import { PostServerAction } from './protocol/post/PostServerAction';
import pm2 from 'pm2';
import { EServerAction } from './Enums';

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
      console.log(origin, allowedOrigins)
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

app.post((new PostSum()).url(), async (req, res) => {
  const {num1, num2} = req.body;
  const response: GetSumResponse = {
    sum: num1 + num2,
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

// INIT
async function init () {
  await pm.loadProcessConfigJSON('configs/pm2.config.json');
  app.listen(PORT, () => {
    Debug.log(`Server Listening on :${PORT}`);
  });
}

init();
