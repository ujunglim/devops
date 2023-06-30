import RequestBase from '../common/RequestBase';
import ResponseBase from '../common/ResponseBase';

export class PostLogIn extends RequestBase<ReponseLogIn> {
  url(): string {
    return '/login'
  }
  loginEmail: string | undefined;
  password: string | undefined;
  autoLogin: boolean | undefined;
}

export class ReponseLogIn extends ResponseBase{
  isLoggedIn: boolean = false;
  
}
