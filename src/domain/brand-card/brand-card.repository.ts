import { BrandCardEntity, BrandCardUpdateData } from "./brand-card.entity";

export interface BrandCardRepository {
    getBrandCards(): Promise<BrandCardEntity[] | null>;
    findBrandCardById(brcrd_uuid: string): Promise<BrandCardEntity | null>;
    createBrandCard(brandCard: BrandCardEntity): Promise<BrandCardEntity | null>;
    updateBrandCard(brcrd_uuid: string, brandCard: BrandCardUpdateData): Promise<BrandCardEntity | null>;
    deleteBrandCard(brcrd_uuid: string): Promise<BrandCardEntity | null>;
    findBrandCardByName(brcrd_name: string, excludeUuid?: string | null): Promise<BrandCardEntity | null>;
}