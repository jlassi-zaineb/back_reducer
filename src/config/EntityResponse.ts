import { HttpStatusCode } from "../enums/HttpStatusCode";

class ErrorResponse extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;
    
    constructor(name: string, httpCode: HttpStatusCode, description: string) {
      super(description);
      Object.setPrototypeOf(this, new.target.prototype);
    
      this.name = name;
      this.httpCode = httpCode;
    
      Error.captureStackTrace(this);
    }
}

export class BadRequestError extends ErrorResponse {
    constructor(name: string, description: string = 'BadRequest Error') {
        super(name, HttpStatusCode.BAD_REQUEST, description);
    }
}

export class InternalServerError extends ErrorResponse {
    constructor(name: string, description = 'InternalServer Error') {
        super(name, HttpStatusCode.INTERNAL_SERVER, description);
    }
}