import { EProcessStatus } from './Enums';

export class ProcessInfo {
  name: string;
  status: EProcessStatus;
  pid: number;
  cpu: number; // %
  memory: number; // MB
  up_time: string ; // ISOString
  port: number;

  constructor() {
    this.name = '';
    this.status = EProcessStatus.stopped;
    this.pid = -1;
    this.memory = 0;
    this.cpu = 0;
    this.up_time = '';
    this.port = 0;
  }
}