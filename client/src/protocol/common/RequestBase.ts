import axios from 'axios';
import { ErrorCode } from './ErrorCode';
import ResponseBase from './ResponseBase';

const SERVER = "http://192.168.109.15:3001";

export default abstract class RequestBase<ResponseType extends ResponseBase> {
  abstract url(): string;

  async get(): Promise<ResponseType> {
    const url = SERVER + this.url();
    
    return new Promise(async (resolve, reject) => {
      try {
        const res = (await axios.get(url))?.data;
        if (res && (res as ResponseBase).errorcode !== ErrorCode.success) {
          console.error(`[Http] Get ${url} with errorcode ${(res as ResponseBase).errorcode}`);
          reject(res);
          return;
        }
        resolve(res);
      }
      catch(e) {
        console.error(`[Http] Get ${url} failed!`)
        reject(e);
      }
    })  
  }

  async post(): Promise<ResponseType> {
    const url = SERVER + this.url();

    
    return new Promise(async (resolve, reject) => {
      try {
        const res = (await axios.post(url, this))?.data;
        if (res && (res as ResponseBase).errorcode !== ErrorCode.success) {
          console.error(`[Http] Post ${url} with errorcode ${(res as ResponseBase).errorcode}`);
          reject(res);
          return;
        }
        resolve(res);
      }
      catch(e) {
        console.error(`[Http] Post ${url} failed!`)
        reject(e);
      }
    })  
  }
}