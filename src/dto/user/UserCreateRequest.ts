import {hashSync} from "bcrypt";

export interface UserCreateRequest {
    username: string;
    password: string;

}

export const getSQLCreateValues = (req: UserCreateRequest) => {

    var hashedPassword: string = hashSync(req.password, 10);
    
    var sqlValues: string = `"${req.username}", '${hashedPassword}'`

    return sqlValues;
}



