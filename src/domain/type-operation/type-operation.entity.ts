export interface TypeOperationEntity {
    tyop_uuid: string;
    tyop_name: string;
    tyop_description: string;
    tyop_createdat: Date;
    tyop_updatedat: Date;
}

export type TypeOperationUpdateData = Pick<TypeOperationEntity, 'tyop_name' | 'tyop_description'>;