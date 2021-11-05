import { db } from '../../config/database';
import { OkPacket, RowDataPacket } from 'mysql2';
import { TopicCreateRequest, getSQLCreateValues } from '../../dto/topic/TopicCreateRequest';
import { BaseError, ErrorType } from '../../enums/ErrorType';


export interface Topic {
    id: number;
    title?: string;
    description?: string;
    technos?: string;
    topic_databases?: string,
    screenshots?: string;
    created?: Date;
}

/******************************************************************** */
/************************** CREATE ONE TOPIC ************************ */
/******************************************************************** */

export const create = (request: TopicCreateRequest): Promise<number> => {

    return new Promise((resolve, reject) => {
        // const date = new Date().toLocaleString();
        const values: string = getSQLCreateValues(request);

        const ifTopicExists =
            `SELECT
            *
            FROM
            topic WHERE topic.title = "${request.title}" `

        const queryCreateOne =
            'INSERT INTO `topic` ' +
            '(`title`, `description`, `technos` , `topic_databases`, `screenshots`) ' +
            `VALUES (${values});`;

        console.log(queryCreateOne);

        //verify if topic exists before create a new one

        db.query(ifTopicExists, (err, result) => {
            if (err) {
                // Request error

                reject(new BaseError(ErrorType.QUERY_ERROR, err.message));
            } else if ((<RowDataPacket>result).length === 0) {
                db.query(queryCreateOne, (err, result) => {
                    if (err) {
                        // Request error

                        reject(new BaseError(ErrorType.QUERY_ERROR, err.message));
                    } else {
                        // Data inserted

                        const insertId: number = (<OkPacket>result).insertId;
                        resolve(insertId);

                    }
                });
            }
            else {
                reject(new BaseError(ErrorType.TOPIC_EXISTS, "topic exists"));
            }
        })
    });
};

/******************************************************************** */
/************************** FIND ONE TOPIC ************************ */
/******************************************************************** */
export const findOne = (topicId: number): Promise<Topic> => {
    return new Promise((resolve, reject) => {
        const queryFindOne =
            'SELECT * FROM `topic` ' +
            'WHERE topic.id_topic = ?; ';


        db.query(queryFindOne, topicId, (err, result) => {
            if (err) {
                // Request error
                reject(new BaseError(ErrorType.QUERY_ERROR, err.message));

            } else if ((<RowDataPacket>result).length === 0) {
                // Data not found
                reject(new BaseError(ErrorType.NOT_FOUND));

            } else {
                // Data found

                const row = (<RowDataPacket>result)[0];

                const obj: Topic = {
                    id: row.id_topic,
                    title: row.title,
                    description: row.description,
                    technos: JSON.parse(row.technos),
                    screenshots: JSON.parse(row.screenshots),
                    topic_databases: JSON.parse(row.topic_databases)
                };

                // for (var i = 0; i < (<RowDataPacket>result).length; i++) {
                //     const row = (<RowDataPacket>result)[i];
                //     obj.link[row.id_screenshot] = row.link;
                //     obj.language_name[row.id_topic_language] = row.language_name;
                // }

                // obj.link = obj.link.filter(function (element: any) {
                //     return element !== null
                // });

                // obj.language_name = obj.language_name.filter(function (element: any) {
                //     return element !== null
                // });

                resolve(obj);

            };
        });
    });
};

/******************************************************************** */
/************************** FIND ALL TOPIC ************************ */
/******************************************************************** */
export const findAll = (): Promise<Topic[]> => {
    return new Promise((resolve, reject) => {
        const queryFindAll = 'SELECT * FROM `topic` ';

        db.query(queryFindAll, (err, result) => {
            if (err) {
                // Request error

                reject(new BaseError(ErrorType.QUERY_ERROR, err.message));
            } else {
                // Data treatment

                var resultList: Topic[] = [];

                for (var i = 0; i < (<RowDataPacket>result).length; i++) {

                    const row = (<RowDataPacket>result)[i];

                    const obj: Topic = {
                        id: row.id_topic,
                        title: row.title,
                        description: row.description,
                        technos: JSON.parse(row.technos),
                        screenshots: JSON.parse(row.screenshots),
                        topic_databases: JSON.parse(row.topic_databases)
                    };
                    resultList.push(obj);
                }

                resolve(resultList)
            }
        });
    });
};

/******************************************************************** */
/************************** UPDATE ONE TOPIC ************************ */
/******************************************************************** */
export const update = (topicId: number, values: string): Promise<number> => {
    return new Promise((resolve, reject) => {

        // Check if topic exists
        const checkQueryString = `SELECT * FROM topic WHERE id_topic = ?;`;

        db.query(checkQueryString, topicId, (err, result) => {
            if (err) {
                // Request error

                reject(new BaseError(ErrorType.QUERY_ERROR, err.message));
            } else if ((<RowDataPacket>result).length === 0) {
                // Data not found

                reject(new BaseError(ErrorType.NOT_FOUND));
            }
        });


        // If found, update
        const updateQueryString = `UPDATE topic SET ${values} WHERE id_topic = ?;`;
    
        db.query(updateQueryString, topicId, (err, result) => {
            if (err) {
                // Request error

                reject(new BaseError(ErrorType.QUERY_ERROR, err.message));
            } else {
                // Data updated

                const changedRows = (<OkPacket>result).changedRows;
                resolve(changedRows);
            }
        });
    });
};

/******************************************************************** */
/************************** DELETE ONE TOPIC ************************ */
/******************************************************************** */
export const deleteOne = (topicId: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        const queryString = `DELETE FROM topic WHERE id_topic = ?;`;

        db.query(queryString, topicId, (err, result) => {
            if (err) {
                // Request error

                reject(new BaseError(ErrorType.QUERY_ERROR, err.message));
            } else {
                // Data deleted if found

                const affectedRows = (<OkPacket>result).affectedRows;
                resolve(affectedRows);
            }
        });
    });
};