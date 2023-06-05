import { EServerAction } from '../common/Enums'
import RequestBase from '../common/RequestBase';
import ResponseBase from '../common/ResponseBase';

export class PostServerAction extends RequestBase<ResponseBase> {
  url(): string {
    return "/server/action"
  }

  action : EServerAction | undefined;
  severName: string | undefined;
}