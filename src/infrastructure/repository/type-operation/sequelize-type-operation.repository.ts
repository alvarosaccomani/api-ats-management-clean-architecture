import { Sequelize } from 'sequelize';
import { TypeOperationEntity, TypeOperationUpdateData } from "../../../domain/type-operation/type-operation.entity";
import { TypeOperationRepository } from "../../../domain/type-operation/type-operation.repository";
import { SequelizeTypeOperation } from "../../model/type-operation/type-operation.model";
import { Op } from "sequelize";

export class SequelizeTypeOperationRepository implements TypeOperationRepository {
    async getTypeOperations(): Promise<TypeOperationEntity[] | null> {
        try {
            const typeOperations = await SequelizeTypeOperation.findAll({
                order: [
                    [Sequelize.col('tyop_name'), 'ASC']
                ]
            });
            if(!typeOperations) {
                throw new Error(`No hay tipos de operaciones`)
            };
            return typeOperations;
        } catch (error: any) {
            console.error('Error en getTypeOperations:', error.message);
            throw error;
        }
    }

    async findTypeOperationById(tyop_uuid: string): Promise<TypeOperationEntity | null> {
        try {
            const typeOperation = await SequelizeTypeOperation.findOne({ 
                where: { 
                    tyop_uuid: tyop_uuid ?? null
                } 
            });
            if(!typeOperation) {
                throw new Error(`No hay tipo de operación con el Id: ${tyop_uuid}`);
            };
            return typeOperation.dataValues;
        } catch (error: any) {
            console.error('Error en findTypeOperationById:', error.message);
            throw error;
        }
    }

    async createTypeOperation(typeOperation: TypeOperationEntity): Promise<TypeOperationEntity | null> {
        try {
            let { tyop_uuid, tyop_name, tyop_description, tyop_createdat, tyop_updatedat } = typeOperation
            const result = await SequelizeTypeOperation.create({ tyop_uuid, tyop_name, tyop_description, tyop_createdat, tyop_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el tipo de operación`);
            }
            let newTypeOperation = result.dataValues as SequelizeTypeOperation
            return newTypeOperation;
        } catch (error: any) {
            console.error('Error en createTypeOperation:', error.message);
            throw error;
        }
    }

    async updateTypeOperation(tyop_uuid: string, typeOperation: TypeOperationUpdateData): Promise<TypeOperationEntity | null> {
        try {
            const [updatedCount, [updatedTypeOperation]] = await SequelizeTypeOperation.update(
                {
                    tyop_name: typeOperation.tyop_name,
                    tyop_description: typeOperation.tyop_description
                },
                {
                    where: { tyop_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el tipo de operación`);
            }
            return updatedTypeOperation.get({ plain: true }) as TypeOperationEntity;
        } catch (error: any) {
            console.error('Error en updateTypeOperation:', error.message);
            throw error;
        }
    }

    async deleteTypeOperation(tyop_uuid: string): Promise<TypeOperationEntity | null> {
        try {
            const typeOperation = await this.findTypeOperationById(tyop_uuid);
            const result = await SequelizeTypeOperation.destroy({ where: { tyop_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el tipo de operación`);
            };
            return typeOperation;
        } catch (error: any) {
            console.error('Error en deleteTypeOperation:', error.message);
            throw error;
        }
    }

    async findTypeOperationByName(tyop_name: string, excludeUuid?: string | null): Promise<TypeOperationEntity | null> {
        try {
            const whereCondition: any = { tyop_name: tyop_name ?? null };
            if (excludeUuid) {
                whereCondition.tyop_uuid = { [Op.ne]: excludeUuid };
            }
            const typeOperation = await SequelizeTypeOperation.findOne({ 
                where: whereCondition
            });
            return typeOperation;
        } catch (error: any) {
            console.error('Error en findTypeOperationByName:', error.message);
            throw error;
        }
    }
}