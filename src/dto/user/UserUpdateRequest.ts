import moment from 'moment';
import {hashSync} from 'bcrypt';

export interface UserUpdateRequest {
    user_id: number;
    username: string;
    password: string;
    created: Date;
}


export const getSQLUpdateValues = (req: UserUpdateRequest) => {


    var sqlValues: string[] = [];

    if(req.username) {
        sqlValues.push(`username = "${ req.username }"`);
    }

    if(req.password) {
        var hashedPassword: string = hashSync(req.password, 10);
        sqlValues.push(`password = "${ hashedPassword }"`);
    }
 

    if(req.created && moment(req.created, "YYYY-MM-DD", true).isValid()) {
        sqlValues.push(`created = "${ req.created }"`);
    }

    return sqlValues.join(', ');
}
