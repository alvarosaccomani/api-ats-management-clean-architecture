import moment from 'moment';
import { ScopeUserEntity } from "./scope-user.entity";

export class ScopeUserValue implements ScopeUserEntity {
    scp_uuid: string;
    usr_uuid: string;
    scpu_role: string;
    scpu_createdat: Date;
    
    constructor({
        scp_uuid,
        usr_uuid,
        scpu_role,
        scpu_createdat
    }:{ 
        scp_uuid: string;
        usr_uuid: string;
        scpu_role?: string;
        scpu_createdat?: Date;
    }) {
        this.scp_uuid = scp_uuid;
        this.usr_uuid = usr_uuid;
        this.scpu_role = scpu_role ?? 'MEMBER';
        this.scpu_createdat = scpu_createdat ?? moment().toDate();
    }
}