import { ErrorCode } from '../common/ErrorCode';

export default abstract class ResponseBase {
  errorcode: ErrorCode = ErrorCode.success;
}