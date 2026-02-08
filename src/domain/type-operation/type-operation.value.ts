import { v4 as uuid } from "uuid";
import moment from 'moment';
import { TypeOperationEntity } from "./type-operation.entity";

export class TypeOperationValue implements TypeOperationEntity {
    tyop_uuid: string;
    tyop_name: string;
    tyop_description: string;
    tyop_createdat: Date;
    tyop_updatedat: Date;
    
    constructor({
            tyop_uuid,
            tyop_name,
            tyop_description,
            tyop_createdat,
            tyop_updatedat
        }:{ 
            tyop_uuid?: string,
            tyop_name: string,
            tyop_description?: string,
            tyop_createdat?: Date,
            tyop_updatedat?: Date
        }) {
        this.tyop_uuid = tyop_uuid ?? uuid();
        this.tyop_name = tyop_name;
        this.tyop_description = tyop_description ?? '';
        this.tyop_createdat = tyop_createdat ?? moment().toDate();
        this.tyop_updatedat = tyop_updatedat ?? moment().toDate();
    }
}