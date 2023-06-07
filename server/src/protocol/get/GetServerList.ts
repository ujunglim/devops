import RequestBase from '../common/RequestBase';
import { EProcessStatus } from '../common/Enums';
import ResponseBase from '../common/ResponseBase';

// request parameters
export class GetServerList extends RequestBase<GetServerListResponse> {
  url(): string {
    return "/server/list"
  }
}

// response
export class GetServerListResponse extends ResponseBase {
  processList:ProcessInfo[] = []
}

export class ProcessInfo {
  name: string = '';
  status: EProcessStatus = EProcessStatus.stopped;
  pid: number = -1;
  cpu: number = 0;
  memory: number = 0;
  up_time: string = ''; // ISOString
  port: number = 0;
}
