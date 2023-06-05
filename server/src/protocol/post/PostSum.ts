import RequestBase from '../common/RequestBase';
import ResponseBase from '../common/ResponseBase';

// request
export default class PostSum extends RequestBase<PostSumResponse> {
  url(): string {
    return '/sum'
  }
  num1: number | undefined
  num2: number | undefined
}
// response
export class PostSumResponse extends ResponseBase{
  sum: number = 0;
}