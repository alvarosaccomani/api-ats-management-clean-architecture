import { Sequelize } from 'sequelize';
import { TypeCardEntity, TypeCardUpdateData } from "../../../domain/type-card/type-card.entity";
import { TypeCardRepository } from "../../../domain/type-card/type-card.repository";
import { SequelizeTypeCard } from "../../model/type-card/type-card.model";
import { Op } from "sequelize";

export class SequelizeTypeCardRepository implements TypeCardRepository {
    async getTypeCards(): Promise<TypeCardEntity[] | null> {
        try {
            const typeCards = await SequelizeTypeCard.findAll({
                order: [
                    [Sequelize.col('tycrd_name'), 'ASC']
                ]
            });
            if(!typeCards) {
                throw new Error(`No hay tipos de tarjetas`)
            };
            return typeCards;
        } catch (error: any) {
            console.error('Error en getTypeCards:', error.message);
            throw error;
        }
    }

    async findTypeCardById(tycrd_uuid: string): Promise<TypeCardEntity | null> {
        try {
            const typeCard = await SequelizeTypeCard.findOne({ 
                where: { 
                    tycrd_uuid: tycrd_uuid ?? null
                } 
            });
            if(!typeCard) {
                throw new Error(`No hay tipo de tarjeta con el Id: ${tycrd_uuid}`);
            };
            return typeCard.dataValues;
        } catch (error: any) {
            console.error('Error en findTypeCardById:', error.message);
            throw error;
        }
    }

    async createTypeCard(typeCard: TypeCardEntity): Promise<TypeCardEntity | null> {
        try {
            let { tycrd_uuid, tycrd_name, tycrd_description, tycrd_createdat, tycrd_updatedat } = typeCard
            const result = await SequelizeTypeCard.create({ tycrd_uuid, tycrd_name, tycrd_description, tycrd_createdat, tycrd_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el tipo de tarjeta`);
            }
            let newTypeCard = result.dataValues as SequelizeTypeCard
            return newTypeCard;
        } catch (error: any) {
            console.error('Error en createTypeCard:', error.message);
            throw error;
        }
    }

    async updateTypeCard(tycrd_uuid: string, typeCard: TypeCardUpdateData): Promise<TypeCardEntity | null> {
        try {
            const [updatedCount, [updatedTypeCard]] = await SequelizeTypeCard.update(
                {
                    tycrd_name: typeCard.tycrd_name,
                    tycrd_description: typeCard.tycrd_description
                },
                {
                    where: { tycrd_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el tipo de tarjeta`);
            }
            return updatedTypeCard.get({ plain: true }) as TypeCardEntity;
        } catch (error: any) {
            console.error('Error en updateTypeCard:', error.message);
            throw error;
        }
    }

    async deleteTypeCard(tycrd_uuid: string): Promise<TypeCardEntity | null> {
        try {
            const typeCard = await this.findTypeCardById(tycrd_uuid);
            const result = await SequelizeTypeCard.destroy({ where: { tycrd_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el tipo de tarjeta`);
            };
            return typeCard;
        } catch (error: any) {
            console.error('Error en deleteTypeCard:', error.message);
            throw error;
        }
    }

    async findTypeCardByName(tycrd_name: string, excludeUuid?: string | null): Promise<TypeCardEntity | null> {
        try {
            const whereCondition: any = { tycrd_name: tycrd_name ?? null };
            if (excludeUuid) {
                whereCondition.tycrd_uuid = { [Op.ne]: excludeUuid };
            }
            const typeCard = await SequelizeTypeCard.findOne({ 
                where: whereCondition
            });
            return typeCard;
        } catch (error: any) {
            console.error('Error en findTypeCardByName:', error.message);
            throw error;
        }
    }
}