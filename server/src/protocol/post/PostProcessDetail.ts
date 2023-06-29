import RequestBase from '../common/RequestBase';
import ResponseBase from '../common/ResponseBase';

export class PostProcessDetail extends RequestBase<ResponseProcessDetail>{
  url(): string {
    return `/server/detail`
  }
  name: string = '';
}

export class ResponseProcessDetail extends ResponseBase {
  date: string[] = [];
  data: number[] = [];
}