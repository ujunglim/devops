export enum EProcessStatus {
  stopped = "stopped",
  stopping = "stopping",
  online = "online",
  launching = "launching",
  errored = "errored",
  oneLaunchStatus = "one-launch-status",
}

export enum EServerAction {
  start ='start',
  stop = 'stop',
  restart = 'restart',
}

export enum logStatus {
  error = 'error',
  info = 'info',
}