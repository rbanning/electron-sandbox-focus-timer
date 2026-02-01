import { using } from "../misc";
import { Nullable } from "../types";
import { httpResponseHelper } from "./http-response-help";
import { primitive } from "./primitive";

export const httpResponseErrorFields = ['message', 'reason', 'error', 'errors', 'code'] as const;
export type HttpResponseErrorField = typeof httpResponseErrorFields[number];

type ResponseError = {[key in HttpResponseErrorField]?: Nullable<string>} 
export interface IHttpResponseError {
  fields: ResponseError;
  additionalFields?: Nullable<Record<string, Nullable<string>>>;
  toArray: () => string[];
}

export class HttpResponseError implements IHttpResponseError {
  fields: ResponseError = {};
  additionalFields?: Nullable<Record<string, Nullable<string>>>;

  constructor(obj?: unknown, additionalFieldKeys?: Nullable<string[]>) {
    if (primitive.isString(obj)) {
      this.fields.message = obj;
    }    
    else if (primitive.isObject(obj)) {
      using(obj as ResponseError, arg => {
        httpResponseErrorFields.forEach(key => this.fields[key] = arg[key]);        
      });

      //additional fields
      if (Array.isArray(additionalFieldKeys)) {
        this.additionalFields = additionalFieldKeys.reduce((ret: Record<string, Nullable<string>>, key) => {
          ret[key] = primitive.isNullish(obj[key]) 
            ? obj[key]        //null or undefined
            : `${obj[key]}`;  //convert to string
          return ret;
        }, {});
      }
    }    
    else if (Array.isArray(obj)) {
      for (let index = 0; index < obj.length; index++) {
        this.fields[httpResponseErrorFields[index]] = obj[index];        
      }
    }
    else if (obj) {
      console.warn("Invalid constructor argument for HttpResponseError", {obj});
      throw new Error("Unable to instantiate HttpResponseError - invalid argument type");
    }   
    
  }

  toArray() {
    return httpResponseErrorFields.reduce((ret: string[], key) => {
      if (primitive.isString(this.fields[key])) { ret.push(this.fields[key]); }
      return ret;
    }, []);
  }

  toString() {
    let errorString = httpResponseErrorFields.reduce((ret: Nullable<string>, key) => {
      if (!ret && primitive.isString(this.fields[key])) {
        ret = this.fields[key];
      }
      return ret;
    }, null);

    //if we couldn't find the error message in the traditional response fields,
    // use the first error message from the additionalFields
    if (!errorString && this.additionalFields) {
      errorString = Object.keys(this.additionalFields).reduce((ret: Nullable<string>, key) => {
        if (!ret && this.additionalFields && primitive.isString(this.additionalFields[key])) {
          ret = this.additionalFields[key];
        }
        return ret;
      }, null);
    }

    return errorString ?? 'Unknown error from fetch request';
  }

  public static async parseResponse(resp: Response, additionalFieldKeys?: Nullable<string[]>) {
    try {
      const contentType = httpResponseHelper.getContentType(resp);
      if (contentType) {
        switch(contentType) {
          case 'json': {
            const data = await resp.json();
            return new HttpResponseError(data, additionalFieldKeys);
          }
          case 'text': {
            const data = await resp.text();
            return new HttpResponseError(data);
          }
          default: {
            throw new Error(`Unsupported content type: ${contentType}`);
          }
        }
      }
      //else
      throw new Error("could not determine content type of response");
    } catch (error) {
      console.warn("HttpResponseError.parseResponse Error", {resp, error});
      throw new Error("HttpResponseError.parseResponse Error");
    }
  }
  
}