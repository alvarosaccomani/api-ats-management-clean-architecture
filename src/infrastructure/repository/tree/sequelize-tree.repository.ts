import { Sequelize } from 'sequelize';
import { TreeEntity } from "../../../domain/tree/tree.entity";
import { TreeRepository } from "../../../domain/tree/tree.repository";
import { SequelizeCard } from "../../model/card/card.model";
import { Op } from "sequelize";
import { SequelizeTypeCard } from '../../model/type-card/type-card.model';
import { SequelizeBrandCard } from '../../model/brand-card/brand-card.model';
import { SequelizeBank } from '../../model/bank/bank.model';
import { SequelizePeriod } from '../../model/period/period.model';

export class SequelizeTreeRepository implements TreeRepository {
    async getCardsTree(usr_uuid: string): Promise<TreeEntity[] | null> {
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
                    },
                    {
                        model: SequelizePeriod,
                        as: 'periods'
                    }
                ],
                order: [
                    [Sequelize.col('crd_maskedcardnumber'), 'ASC']
                ]
            });
            if(!cards) {
                throw new Error(`No hay tarjetas`)
            };

            // Formatear los datos al formato de árbol
            const treeData: TreeEntity[] = cards.map((card, index) => {
                const cardKey = `${index + 1}`;
                
                return {
                    title: `${card.ban?.ban_name} ${card.brcrd?.brcrd_name} ${card.tycrd?.tycrd_name} (${card.crd_last4digits})` || card.crd_uuid || `Tarjeta ${index + 1}`,
                    key: cardKey,
                    icon: 'folder',
                    isLeaf: false,
                    children: card.periods?.map((period: SequelizePeriod, periodIndex: number) => {
                        const periodKey = `${cardKey}-${periodIndex + 1}`;
                        
                        return {
                            title: period.per_periodnumber.toString() || `Período ${periodIndex + 1}`,
                            key: periodKey,
                            icon: 'file',
                            isLeaf: true
                        };
                    })
                };
            });

            return treeData;
        } catch (error: any) {
            console.error('Error en getCards:', error.message);
            throw error;
        }
    }
}