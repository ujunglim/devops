import { EServerAction } from '../common/Enums'
import RequestBase from '../common/RequestBase';
import ResponseBase from '../common/ResponseBase';
import { ProcessInfo } from '../get/GetServerList';

export class PostServerAction extends RequestBase<ResponseServerAction> {
  url(): string {
    return "/server/action"
  }

  action : EServerAction | undefined;
  serverName: string | undefined;
}

export class ResponseServerAction extends ResponseBase{
  processList:ProcessInfo[] = [];
}