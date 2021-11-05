import { db } from '../../config/database';
import { OkPacket, RowDataPacket } from 'mysql2';
import { UserCreateRequest, getSQLCreateValues } from '../../dto/user/UserCreateRequest';
import { BaseError, ErrorType } from '../../enums/ErrorType';


export interface User {
    id: number;
    username?: string;
    password?: string;
    created?: Date;
}

/******************************************************************** */
/************************** CREATE ONE TOPIC ************************ */
/******************************************************************** */

export const create = (request: UserCreateRequest): Promise<number> => {

    return new Promise((resolve, reject) => {
        // const date = new Date().toLocaleString();
        const values: string = getSQLCreateValues(request);

        const ifUserExists =
            `SELECT
            *
            FROM
            user WHERE user.username = "${request.username}" `

        const queryCreateOne =
            'INSERT INTO `user` ' +
            '(`username`, `password`) ' +
            `VALUES (${values});`;


        //verify if topic exists before create a new one

        db.query(ifUserExists, (err, result) => {
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
                reject(new BaseError(ErrorType.USER_EXISTS, "user exists"));
            }
        })
    });
};

/******************************************************************** */
/************************** FIND ONE TOPIC ************************ */
/******************************************************************** */
export const findOne = (userId: number): Promise<User> => {
    return new Promise((resolve, reject) => {

        const queryFindOne =
            'SELECT * FROM `user` ' +
            'WHERE user.id_user = ?; ';

        db.query(queryFindOne, userId, (err, result) => {
            if (err) {
                // Request error
                reject(new BaseError(ErrorType.QUERY_ERROR, err.message));

            } else if ((<RowDataPacket>result).length === 0) {
                // Data not found
                reject(new BaseError(ErrorType.NOT_FOUND));

            } else {
                // Data found

                const row = (<RowDataPacket>result)[0];

                const obj: User = {
                    id: row.id_user,
                    username: row.username,
                    // password: row.password,
                };

                resolve(obj);

            };
        });
    });
};

/******************************************************************** */
/************************** FIND ALL USERs ************************ */
/******************************************************************** */
export const findAll = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        const queryFindAll = 'SELECT * FROM `user` ';

        db.query(queryFindAll, (err, result) => {
            if (err) {
                // Request error

                reject(new BaseError(ErrorType.QUERY_ERROR, err.message));
            } else {
                // Data treatment

                var resultList: User[] = [];

                for (var i = 0; i < (<RowDataPacket>result).length; i++) {

                    const row = (<RowDataPacket>result)[i];

                    const obj: User = {
                        id: row.id_user,
                        username: row.username,
                        // password: row.password,
                    };

                    resultList.push(obj);
                }

                resolve(resultList)
            }
        });
    });
};

/******************************************************************** */
/************************** UPDATE ONE USER ************************ */
/******************************************************************** */
export const update = (userId: number, values: string): Promise<number> => {
    return new Promise((resolve, reject) => {

        // Check if topic exists
        const checkQueryString = `SELECT * FROM user WHERE id_user = ?;`;

        db.query(checkQueryString, userId, (err, result) => {
            if (err) {
                // Request error

                reject(new BaseError(ErrorType.QUERY_ERROR, err.message));
            } else if ((<RowDataPacket>result).length === 0) {
                // Data not found

                reject(new BaseError(ErrorType.NOT_FOUND));
            }
        });


        // If found, update
        const updateQueryString = `UPDATE user SET ${values} WHERE id_user = ?;`;

        db.query(updateQueryString, userId, (err, result) => {
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
export const deleteOne = (userId: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        const queryString = `DELETE FROM user WHERE id_user = ?;`;

        db.query(queryString, userId, (err, result) => {
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