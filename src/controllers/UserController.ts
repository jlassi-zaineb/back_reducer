import { BadRequestError, InternalServerError } from '../config/EntityResponse';
import { UserCreateRequest } from '../dto/user/UserCreateRequest';
import { UserUpdateRequest, getSQLUpdateValues } from '../dto/user/UserUpdateRequest';
import { BaseError, ErrorType } from '../enums/ErrorType';
import * as _model from '../model/user/UserModel';

const BASE_NAME: String = "USER";

export const create = async (request: UserCreateRequest) => {
    var insertedId: number = await _model.create(request).catch((err: BaseError) => {
        throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
    });

    return insertedId;
};

export const findOne = async (userId: number) => {
    var result: _model.User = await _model.findOne(userId).catch((err: BaseError) => {
        switch (err.type) {
            case ErrorType.NOT_FOUND:
                throw new BadRequestError(`${BASE_NAME}.NOT_FOUND`, "User could not be found.");
            case ErrorType.QUERY_ERROR:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
            case ErrorType.USER_EXISTS:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
            default:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`);
        }
    });

    return result;
};

export const findAll = async () => {
    var resultList: _model.User[] = await _model.findAll().catch((err: BaseError) => {
        throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
    });

    return resultList;
};

export const update = async (request: UserUpdateRequest) => {
    var values: string = getSQLUpdateValues(request);

    var changedRows: number = await _model.update(request.user_id, values).catch((err: BaseError) => {
        switch (err.type) {
            case ErrorType.NOT_FOUND:
                throw new BadRequestError(`${BASE_NAME}.NOT_FOUND`, "Topic could not be found.");
            case ErrorType.QUERY_ERROR:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
            case ErrorType.USER_EXISTS:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
            default:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`);
        }
    });

    return changedRows;
};

export const deleteOne = async (userId: number) => {
    var affectedRows: number = await _model.deleteOne(userId).catch((err: BaseError) => {
        throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
    });

    return affectedRows;
}