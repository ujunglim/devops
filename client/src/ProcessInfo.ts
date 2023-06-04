import { EProcessStatus } from './Enums';

export class ProcessInfo {
  name: string;
  status: EProcessStatus;
  pid: number;
  cpu: number; // %
  memory: number; // MB
  up_time: number; // timestamp
  port: string;

  constructor() {
    this.name = '';
    this.status = EProcessStatus.stopped;
    this.pid = -1;
    this.memory = 0;
    this.cpu = 0;
    this.up_time = 0;
    this.port = "0";
  }
}