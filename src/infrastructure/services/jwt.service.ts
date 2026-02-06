import * as jwt from 'jsonwebtoken';
import moment from 'moment';
import { UserEntity } from "../../domain/user/user.entity";

const secret = 'web_app_ats_management_api';

export function createToken(user: UserEntity) {
    const payload =  {
        sub: user.usr_uuid,
        usr_nick: user.usr_nick,
        usr_name: user.usr_name,
        usr_surname: user.usr_surname,
        usr_image: user.usr_image,
        usr_email: user.usr_email,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.sign(payload, secret)
}