export interface TypeCardEntity {
    tycrd_uuid: string;
    tycrd_name: string;
    tycrd_description: string;
    tycrd_createdat: Date;
    tycrd_updatedat: Date;
}

export type TypeCardUpdateData = Pick<TypeCardEntity, 'tycrd_name' | 'tycrd_description'>;