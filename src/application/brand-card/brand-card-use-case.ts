import { BrandCardRepository } from "../../domain/brand-card/brand-card.repository";
import { BrandCardValue } from "../../domain/brand-card/brand-card.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class BrandCardUseCase {
    constructor(
        private readonly brandCardRepository: BrandCardRepository
    ) {
        this.getBrandCards = this.getBrandCards.bind(this);
        this.getDetailBrandCard = this.getDetailBrandCard.bind(this);
        this.createBrandCard = this.createBrandCard.bind(this);
        this.updateBrandCard = this.updateBrandCard.bind(this);
        this.deleteBrandCard = this.deleteBrandCard.bind(this);
        this.findBrandCardByName = this.findBrandCardByName.bind(this);
    }

    public async getBrandCards() {
        try {
            const brandCards = await this.brandCardRepository.getBrandCards();
            if(!brandCards) {
                throw new Error('No hay marcas de tarjetas.');
            }
            return brandCards.map(brandCard => ({
                brcrd_uuid: brandCard.brcrd_uuid,
                brcrd_name: brandCard.brcrd_name,
                brcrd_description: brandCard.brcrd_description,
                brcrd_createdat: TimezoneConverter.toIsoStringInTimezone(brandCard.brcrd_createdat, 'America/Buenos_Aires'),
                brcrd_updatedat: TimezoneConverter.toIsoStringInTimezone(brandCard.brcrd_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getBrandCards (use case):', error.message);
            throw error;
        }
    }

    public async getDetailBrandCard(brcrd_uuid: string) {
        try {
            const brandCard = await this.brandCardRepository.findBrandCardById(brcrd_uuid);
            if(!brandCard) {
                throw new Error(`No hay marca de tarjeta con el Id: ${brcrd_uuid}`);
            }
            return {
                brcrd_uuid: brandCard.brcrd_uuid,
                brcrd_name: brandCard.brcrd_name,
                brcrd_description: brandCard.brcrd_description,
                brcrd_createdat: TimezoneConverter.toIsoStringInTimezone(brandCard.brcrd_createdat, 'America/Buenos_Aires'),
                brcrd_updatedat: TimezoneConverter.toIsoStringInTimezone(brandCard.brcrd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailBrandCard (use case):', error.message);
            throw error;
        }
    }
    
    public async createBrandCard({ brcrd_uuid, brcrd_name, brcrd_description } : { brcrd_uuid?: string, brcrd_name: string, brcrd_description?: string }) {
        try {
            const brandCardValue = new BrandCardValue({ brcrd_uuid, brcrd_name, brcrd_description });
            const brandCardCreated = await this.brandCardRepository.createBrandCard(brandCardValue);
            if(!brandCardCreated) {
                throw new Error(`No se pudo insertar la marca de tarjeta.`);
            }
            return {
                brcrd_uuid: brandCardCreated.brcrd_uuid,
                brcrd_name: brandCardCreated.brcrd_name,
                brcrd_description: brandCardCreated.brcrd_description,
                brcrd_createdat: TimezoneConverter.toIsoStringInTimezone(brandCardCreated.brcrd_createdat, 'America/Buenos_Aires'),
                brcrd_updatedat: TimezoneConverter.toIsoStringInTimezone(brandCardCreated.brcrd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createBrandCard (use case):', error.message);
            throw error;
        }
    }

    public async updateBrandCard(brcrd_uuid: string, { brcrd_name, brcrd_description } : { brcrd_name: string, brcrd_description: string }) {
        try {
            const brandCardUpdated = await this.brandCardRepository.updateBrandCard(brcrd_uuid, { brcrd_name, brcrd_description });
            if(!brandCardUpdated) {
                throw new Error(`No se pudo actualizar la marca de tarjeta.`);
            }
            return {
                brcrd_uuid: brandCardUpdated.brcrd_uuid,
                brcrd_name: brandCardUpdated.brcrd_name,
                brcrd_description: brandCardUpdated.brcrd_description,
                brcrd_createdat: TimezoneConverter.toIsoStringInTimezone(brandCardUpdated.brcrd_createdat, 'America/Buenos_Aires'),
                brcrd_updatedat: TimezoneConverter.toIsoStringInTimezone(brandCardUpdated.brcrd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateBrandCard (use case):', error.message);
            throw error;
        }
    }

    public async deleteBrandCard(brcrd_uuid: string) {
        try {
            const brandCardDeleted = await this.brandCardRepository.deleteBrandCard(brcrd_uuid);
            if(!brandCardDeleted) {
                throw new Error(`No se pudo eliminar la marca de tarjeta.`);
            }
            return {
                brcrd_uuid: brandCardDeleted.brcrd_uuid,
                brcrd_name: brandCardDeleted.brcrd_name,
                brcrd_description: brandCardDeleted.brcrd_description,
                brcrd_createdat: TimezoneConverter.toIsoStringInTimezone(brandCardDeleted.brcrd_createdat, 'America/Buenos_Aires'),
                brcrd_updatedat: TimezoneConverter.toIsoStringInTimezone(brandCardDeleted.brcrd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteBrandCard (use case):', error.message);
            throw error;
        }
    }

    public async findBrandCardByName(brcrd_name: string, excludeUuid?: string) {
        try {
            const brandCard = await this.brandCardRepository.findBrandCardByName(brcrd_name, excludeUuid)
            if(brandCard) {
                throw new Error(`Ya existe una marca de tarjeta con el nombre ${brcrd_name}.`);
            }
            return brandCard
        } catch (error: any) {
            console.error('Error en findBrandCardByName (use case):', error.message);
            throw error;
        }
    }
}