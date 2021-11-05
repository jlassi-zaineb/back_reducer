import { BadRequestError, InternalServerError } from '../config/EntityResponse';
import { TopicCreateRequest } from '../dto/topic/TopicCreateRequest';
import { TopicUpdateRequest, getSQLUpdateValues } from '../dto/topic/TopicUpdateRequest';
import { BaseError, ErrorType } from '../enums/ErrorType';
import * as _model from '../model/topic/TopicModel';

const BASE_NAME: String = "TOPIC";

export const create = async (request: TopicCreateRequest) => {
    var insertedId: number = await _model.create(request).catch((err: BaseError) => {
        throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
    });

    return insertedId;
};

export const findOne = async (topicId: number) => {
    var result: _model.Topic = await _model.findOne(topicId).catch((err: BaseError) => {
        switch (err.type) {
            case ErrorType.NOT_FOUND:
                throw new BadRequestError(`${BASE_NAME}.NOT_FOUND`, "Topic could not be found.");
            case ErrorType.QUERY_ERROR:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
            case ErrorType.TOPIC_EXISTS:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
            default:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`);
        }
    });

    return result;
};

export const findAll = async () => {
    var resultList: _model.Topic[] = await _model.findAll().catch((err: BaseError) => {
        throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
    });

    return resultList;
};

export const update = async (request: TopicUpdateRequest) => {
    var values: string = getSQLUpdateValues(request);

    var changedRows: number = await _model.update(request.topic_id, values).catch((err: BaseError) => {
        switch (err.type) {
            case ErrorType.NOT_FOUND:
                throw new BadRequestError(`${BASE_NAME}.NOT_FOUND`, "Topic could not be found.");
            case ErrorType.QUERY_ERROR:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
            case ErrorType.TOPIC_EXISTS:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
            default:
                throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`);
        }
    });

    return changedRows;
};

export const deleteOne = async (topicId: number) => {
    var affectedRows: number = await _model.deleteOne(topicId).catch((err: BaseError) => {
        throw new InternalServerError(`${BASE_NAME}.INTERNAL_SERVER_ERROR`, `${err.message}`);
    });

    return affectedRows;
}