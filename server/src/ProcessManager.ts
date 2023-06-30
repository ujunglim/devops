import Debug from './Debug';
import { ProcessConfig } from './ProcessConfig';
import { loadJson } from './utils/loadJson';
import pm2, { ProcessDescription } from 'pm2';
import { ProcessInfo } from './ProcessInfo';
import { EProcessStatus } from './protocol/common/Enums';

export default class ProcessManager {
  processConfigList: ProcessConfig[];

  constructor() {
    this.processConfigList = [];
  }

  async loadProcessConfigJSON(configPath: string) {
    this.processConfigList = (await loadJson(configPath)).apps;
    Debug.log("[ProcessManager] loaded configs:", this.processConfigList);
  }

  async getProcessDescription(processName: string):Promise<ProcessDescription | null> {
    return new Promise((resolve, reject) => {
      pm2.describe(processName, (err, desc) => {
        if (err) {
          Debug.error(err);
          reject(err);
        } else if (!desc.length) {
          resolve(null);
        } else {
          resolve(desc[0]);
        }
      })
    })
  }

  async getProcessList() {
    const processList = [];

    for (const config of this.processConfigList) {
      let processInfo: ProcessInfo = {
        name: config.name,
        port: parseInt(config.args[1]),
        status: EProcessStatus.stopped,
        pid: -1,
        cpu: 0,
        memory: 0,
        up_time: '',
      }

      const processDesc = await this.getProcessDescription(config.name);

      if(processDesc) {
        processInfo.status = processDesc.pm2_env?.status as EProcessStatus|| EProcessStatus.stopped;
        processInfo.pid = processDesc.pid || -1;
        processInfo.cpu = processDesc.monit?.cpu || 0;
        processInfo.memory = Number((processDesc.monit?.memory / 1024 / 1024).toFixed(2)) || 0;
        processInfo.up_time = new Date(processDesc.pm2_env?.pm_uptime).toISOString() || '';
      }
      processList.push(processInfo);
    }
    return processList;
  }
}