export interface BrandCardEntity {
    brcrd_uuid: string;
    brcrd_name: string;
    brcrd_description: string;
    brcrd_createdat: Date;
    brcrd_updatedat: Date;
}

export type BrandCardUpdateData = Pick<BrandCardEntity, 'brcrd_name' | 'brcrd_description'>;