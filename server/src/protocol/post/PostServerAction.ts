import { ProcessInfo } from '../../ProcessInfo';
import { EServerAction } from '../common/Enums'
import RequestBase from '../common/RequestBase';
import ResponseBase from '../common/ResponseBase';

export class PostServerAction extends RequestBase<ResponseServerAction> {
  url(): string {
    return "/server/action"
  }

  action : EServerAction | undefined;
  severName: string | undefined;
}

export class ResponseServerAction extends ResponseBase{
  processList:ProcessInfo[] = [];
}