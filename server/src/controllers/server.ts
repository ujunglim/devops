import { pm } from '../app';
import pm2 from 'pm2';
import { ErrorCode } from '../protocol/common/ErrorCode';
import { GetServerListResponse } from '../protocol/get/GetServerList';
import { EServerAction, logStatus } from '../protocol/common/Enums';
import fs from 'fs';
import moment from 'moment';
import { logType } from '../protocol/post/PostLog';

// get server list
export const getServerList = async (req, res) => {
  try {
    const response:GetServerListResponse = {
      processList: await pm.getProcessList(),
      errorcode: ErrorCode.success
    };
    res.status(200).json(response);

  } catch (err: any) {
    res.status(500).json({error: err.message})
  }
}

// start, stop a server
export const postServerAction = (req, res) => {
  try {
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
  } catch (err: any) {
    res.status(500).json({error: err.message})
  }
}

// post server detail (graph)
export const postServerGraph = async (req, res) => {
  try {
    const {name} = req.body;
    // memory
    fs.readFile('data.json', 'utf-8', (err, data) => {
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
  } catch(err: any) {
    res.status(500).json({error: err.message})
  }
}

// post server detail (log)
export const postServerLog = async (req, res) => {
  try {
    const {name} = req.body;
    const logs = getLogs(name);

    // sort logs by timestamp
    logs.sort((a, b) => parseInt(a.date) - parseInt(b.date));

    res.status(200).json({
      data: logs,
      errorcode: ErrorCode.success
    })

  } catch (err: any) {
    res.status(500).json({error: err.message})
  }
}

// convert string logs ➡ arr logs
const getLogArr = (log: string): string[] => {
  const logArr = log.split('\n');
  // 마지막에 빈 문자열 제거
  if (logArr[logArr.length-1] === '') {
    logArr.pop();
  }
  return logArr;
}

// get (out, error) logs of server
const getLogs = (name: string): logType[] => {
  const result: any = [];
  const logOutStr: string = fs.readFileSync(`C://Users//Yujung//.pm2//logs//${name}-out.log`, 'utf8');
  const logErrStr: string = fs.readFileSync(`C://Users//Yujung//.pm2//logs//${name}-error.log`, 'utf8');

  const logOutArr = getLogArr(logOutStr);
  const logErrArr = getLogArr(logErrStr);

  for (const logOutElement of logOutArr) {
    const [date, log] = logOutElement.split(': ');
    const isoString = moment(date).toISOString();
    const timestamp = new Date(isoString).getTime();
    result.push({
      date: timestamp,
      log,
      type: logStatus.info,
    })
  }

  for (const logErrElement of logErrArr) {
    const [date, log] = logErrElement.split(': ');
    const isoString = moment(date).toISOString();
    const timestamp = new Date(isoString).getTime();
    result.push({
      date: timestamp,
      log,
      type: logStatus.error,
    })
  }
  return result;
}