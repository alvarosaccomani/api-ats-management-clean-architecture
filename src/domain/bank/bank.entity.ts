export interface BankEntity {
    usr_uuid: string;
    ban_uuid: string;
    ban_name: string;
    ban_description: string;
    ban_createdat: Date;
    ban_updatedat: Date;
}

export type BankUpdateData = Pick<BankEntity, 'ban_name' | 'ban_description'>;