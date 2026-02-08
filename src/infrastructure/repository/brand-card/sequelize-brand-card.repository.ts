import { Sequelize } from 'sequelize';
import { BrandCardEntity, BrandCardUpdateData } from "../../../domain/brand-card/brand-card.entity";
import { BrandCardRepository } from "../../../domain/brand-card/brand-card.repository";
import { SequelizeBrandCard } from "../../model/brand-card/brand-card.model";
import { Op } from "sequelize";

export class SequelizeBrandCardRepository implements BrandCardRepository {
    async getBrandCards(): Promise<BrandCardEntity[] | null> {
        try {
            const brandCards = await SequelizeBrandCard.findAll({
                order: [
                    [Sequelize.col('brcrd_name'), 'ASC']
                ]
            });
            if(!brandCards) {
                throw new Error(`No hay marcas de tarjetas`)
            };
            return brandCards;
        } catch (error: any) {
            console.error('Error en getBrandCards:', error.message);
            throw error;
        }
    }

    async findBrandCardById(brcrd_uuid: string): Promise<BrandCardEntity | null> {
        try {
            const brandCard = await SequelizeBrandCard.findOne({ 
                where: { 
                    brcrd_uuid: brcrd_uuid ?? null
                } 
            });
            if(!brandCard) {
                throw new Error(`No hay marca de tarjeta con el Id: ${brcrd_uuid}`);
            };
            return brandCard.dataValues;
        } catch (error: any) {
            console.error('Error en findBrandCardById:', error.message);
            throw error;
        }
    }

    async createBrandCard(brandCard: BrandCardEntity): Promise<BrandCardEntity | null> {
        try {
            let { brcrd_uuid, brcrd_name, brcrd_description, brcrd_createdat, brcrd_updatedat } = brandCard
            const result = await SequelizeBrandCard.create({ brcrd_uuid, brcrd_name, brcrd_description, brcrd_createdat, brcrd_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado la marca de tarjeta`);
            }
            let newBrandCard = result.dataValues as SequelizeBrandCard
            return newBrandCard;
        } catch (error: any) {
            console.error('Error en createBrandCard:', error.message);
            throw error;
        }
    }

    async updateBrandCard(brcrd_uuid: string, brandCard: BrandCardUpdateData): Promise<BrandCardEntity | null> {
        try {
            const [updatedCount, [updatedBrandCard]] = await SequelizeBrandCard.update(
                {
                    brcrd_name: brandCard.brcrd_name,
                    brcrd_description: brandCard.brcrd_description
                },
                {
                    where: { brcrd_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado la marca de tarjeta`);
            }
            return updatedBrandCard.get({ plain: true }) as BrandCardEntity;
        } catch (error: any) {
            console.error('Error en updateBrandCard:', error.message);
            throw error;
        }
    }

    async deleteBrandCard(brcrd_uuid: string): Promise<BrandCardEntity | null> {
        try {
            const brandCard = await this.findBrandCardById(brcrd_uuid);
            const result = await SequelizeBrandCard.destroy({ where: { brcrd_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado la marca de tarjeta`);
            };
            return brandCard;
        } catch (error: any) {
            console.error('Error en deleteBrandCard:', error.message);
            throw error;
        }
    }

    async findBrandCardByName(brcrd_name: string, excludeUuid?: string | null): Promise<BrandCardEntity | null> {
        try {
            const whereCondition: any = { brcrd_name: brcrd_name ?? null };
            if (excludeUuid) {
                whereCondition.brcrd_uuid = { [Op.ne]: excludeUuid };
            }
            const brandCard = await SequelizeBrandCard.findOne({ 
                where: whereCondition
            });
            return brandCard;
        } catch (error: any) {
            console.error('Error en findBrandCardByName:', error.message);
            throw error;
        }
    }
}