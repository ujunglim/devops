import RequestBase from '../common/RequestBase';
import { EProcessStatus } from '../common/Enums';
import ResponseBase from '../common/ResponseBase';
import { ProcessInfo } from '../../ProcessInfo';

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
