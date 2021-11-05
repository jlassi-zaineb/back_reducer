export enum ErrorType {
    NOT_FOUND,
    TOPIC_EXISTS,
    USER_EXISTS,
    QUERY_ERROR,
}

export class BaseError {
    public readonly type: ErrorType;
    public readonly message?: string;
    
    constructor(type: ErrorType, message?: string) {
        this.type = type;
        if(message) {
            this.message = message;
        }
    }
}