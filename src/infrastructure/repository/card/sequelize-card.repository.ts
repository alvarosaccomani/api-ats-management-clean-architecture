import { Sequelize } from 'sequelize';
import { CardEntity, CardUpdateData } from "../../../domain/card/card.entity";
import { CardRepository } from "../../../domain/card/card.repository";
import { SequelizeCard } from "../../model/card/card.model";
import { Op } from "sequelize";
import { SequelizeTypeCard } from '../../model/type-card/type-card.model';
import { SequelizeBrandCard } from '../../model/brand-card/brand-card.model';
import { SequelizeBank } from '../../model/bank/bank.model';

export class SequelizeCardRepository implements CardRepository {
    async getCards(usr_uuid: string): Promise<CardEntity[] | null> {
        try {
            const cards = await SequelizeCard.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null
                },
                include: [
                    {
                        model: SequelizeTypeCard,
                        as: 'tycrd'
                    },
                    {
                        model: SequelizeBrandCard,
                        as: 'brcrd'
                    },
                    {
                        model: SequelizeBank,
                        as: 'ban'
                    }
                ],
                order: [
                    [Sequelize.col('crd_maskedcardnumber'), 'ASC']
                ]
            });
            if(!cards) {
                throw new Error(`No hay tarjetas`)
            };
            return cards;
        } catch (error: any) {
            console.error('Error en getCards:', error.message);
            throw error;
        }
    }

    async findCardById(usr_uuid: string, crd_uuid: string): Promise<CardEntity | null> {
        try {
            const card = await SequelizeCard.findOne({ 
                where: { 
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null
                } 
            });
            if(!card) {
                throw new Error(`No hay tarjeta con el Id: ${crd_uuid}`);
            };
            return card.dataValues;
        } catch (error: any) {
            console.error('Error en findCardById:', error.message);
            throw error;
        }
    }

    async createCard(card: CardEntity): Promise<CardEntity | null> {
        try {
            let { usr_uuid, crd_uuid, crd_maskedcardnumber, crd_last4digits, tycrd_uuid, brcrd_uuid, ban_uuid, crd_expirationdate, crd_creditlimit, crd_active, crd_createdat, crd_updatedat } = card
            const result = await SequelizeCard.create({ usr_uuid, crd_uuid, crd_maskedcardnumber, crd_last4digits, tycrd_uuid, brcrd_uuid, ban_uuid, crd_expirationdate, crd_creditlimit, crd_active, crd_createdat, crd_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado la tarjeta`);
            }
            let newCard = result.dataValues as SequelizeCard
            return newCard;
        } catch (error: any) {
            console.error('Error en createCard:', error.message);
            throw error;
        }
    }

    async updateCard(usr_uuid: string, crd_uuid: string, card: CardUpdateData): Promise<CardEntity | null> {
        try {
            const [updatedCount, [updatedCard]] = await SequelizeCard.update(
                {
                    crd_maskedcardnumber: card.crd_maskedcardnumber,
                    crd_last4digits: card.crd_last4digits,
                    tycrd_uuid: card.tycrd_uuid,
                    brcrd_uuid: card.brcrd_uuid,
                    ban_uuid: card.ban_uuid,
                    crd_expirationdate: card.crd_expirationdate,
                    crd_creditlimit: card.crd_creditlimit,
                    crd_active: card.crd_active
                },
                {
                    where: { usr_uuid, crd_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado la tarjeta`);
            }
            return updatedCard.get({ plain: true }) as CardEntity;
        } catch (error: any) {
            console.error('Error en updateCard:', error.message);
            throw error;
        }
    }

    async deleteCard(usr_uuid: string, crd_uuid: string): Promise<CardEntity | null> {
        try {
            const card = await this.findCardById(usr_uuid, crd_uuid);
            const result = await SequelizeCard.destroy({ where: { usr_uuid, crd_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado la tarjeta`);
            };
            return card;
        } catch (error: any) {
            console.error('Error en deleteCard:', error.message);
            throw error;
        }
    }

    async findCardByMaskedNumber(usr_uuid: string, crd_maskedcardnumber: string, excludeUuid?: string | null): Promise<CardEntity | null> {
        try {
            const whereCondition: any = { usr_uuid, crd_maskedcardnumber: crd_maskedcardnumber ?? null };
            if (excludeUuid) {
                whereCondition.crd_uuid = { [Op.ne]: excludeUuid };
            }
            const card = await SequelizeCard.findOne({ 
                where: whereCondition
            });
            return card;
        } catch (error: any) {
            console.error('Error en findCardByMaskedNumber:', error.message);
            throw error;
        }
    }

    async findCardsByType(usr_uuid: string, tycrd_uuid: string): Promise<CardEntity[] | null> {
        try {
            const cards = await SequelizeCard.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    tycrd_uuid: tycrd_uuid ?? null
                }
            });
            return cards;
        } catch (error: any) {
            console.error('Error en findCardsByType:', error.message);
            throw error;
        }
    }

    async findCardsByBrand(usr_uuid: string, brcrd_uuid: string): Promise<CardEntity[] | null> {
        try {
            const cards = await SequelizeCard.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    brcrd_uuid: brcrd_uuid ?? null
                }
            });
            return cards;
        } catch (error: any) {
            console.error('Error en findCardsByBrand:', error.message);
            throw error;
        }
    }

    async findCardsByBank(usr_uuid: string, ban_uuid: string): Promise<CardEntity[] | null> {
        try {
            const cards = await SequelizeCard.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    ban_uuid: ban_uuid ?? null
                }
            });
            return cards;
        } catch (error: any) {
            console.error('Error en findCardsByBank:', error.message);
            throw error;
        }
    }

    async findActiveCards(usr_uuid: string): Promise<CardEntity[] | null> {
        try {
            const cards = await SequelizeCard.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_active: true
                }
            });
            return cards;
        } catch (error: any) {
            console.error('Error en findActiveCards:', error.message);
            throw error;
        }
    }
}