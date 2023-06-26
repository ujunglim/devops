import RequestBase from '../common/RequestBase';
import ResponseBase from '../common/ResponseBase';

// request parameters
export class GetIP extends RequestBase<GetIPResponse> {
  url(): string {
    return "/ip"
  }
}

// response
export class GetIPResponse extends ResponseBase {
  ip: string = '';
}
