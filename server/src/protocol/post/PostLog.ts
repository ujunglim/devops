import { logStatus } from '../../Enums';
import RequestBase from '../common/RequestBase';
import ResponseBase from '../common/ResponseBase';

export class PostLog extends RequestBase<ResponseLog>{
  url(): string {
    return `/server/detail/log`
  }
  name: string = '';
}

export class ResponseLog extends ResponseBase {
  data: logType[] = [];
}

export interface logType {
  date: string,
  log: string,
  type: logStatus,
}