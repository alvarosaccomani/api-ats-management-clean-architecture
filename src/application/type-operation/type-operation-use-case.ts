import { TypeOperationRepository } from "../../domain/type-operation/type-operation.repository";
import { TypeOperationValue } from "../../domain/type-operation/type-operation.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class TypeOperationUseCase {
    constructor(
        private readonly typeOperationRepository: TypeOperationRepository
    ) {
        this.getTypeOperations = this.getTypeOperations.bind(this);
        this.getDetailTypeOperation = this.getDetailTypeOperation.bind(this);
        this.createTypeOperation = this.createTypeOperation.bind(this);
        this.updateTypeOperation = this.updateTypeOperation.bind(this);
        this.deleteTypeOperation = this.deleteTypeOperation.bind(this);
        this.findTypeOperationByName = this.findTypeOperationByName.bind(this);
    }

    public async getTypeOperations() {
        try {
            const typeOperations = await this.typeOperationRepository.getTypeOperations();
            if(!typeOperations) {
                throw new Error('No hay tipos de operaciones.');
            }
            return typeOperations.map(typeOperation => ({
                tyop_uuid: typeOperation.tyop_uuid,
                tyop_name: typeOperation.tyop_name,
                tyop_description: typeOperation.tyop_description,
                tyop_createdat: TimezoneConverter.toIsoStringInTimezone(typeOperation.tyop_createdat, 'America/Buenos_Aires'),
                tyop_updatedat: TimezoneConverter.toIsoStringInTimezone(typeOperation.tyop_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getTypeOperations (use case):', error.message);
            throw error;
        }
    }

    public async getDetailTypeOperation(tyop_uuid: string) {
        try {
            const typeOperation = await this.typeOperationRepository.findTypeOperationById(tyop_uuid);
            if(!typeOperation) {
                throw new Error(`No hay tipo de operación con el Id: ${tyop_uuid}`);
            }
            return {
                tyop_uuid: typeOperation.tyop_uuid,
                tyop_name: typeOperation.tyop_name,
                tyop_description: typeOperation.tyop_description,
                tyop_createdat: TimezoneConverter.toIsoStringInTimezone(typeOperation.tyop_createdat, 'America/Buenos_Aires'),
                tyop_updatedat: TimezoneConverter.toIsoStringInTimezone(typeOperation.tyop_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailTypeOperation (use case):', error.message);
            throw error;
        }
    }
    
    public async createTypeOperation({ tyop_uuid, tyop_name, tyop_description } : { tyop_uuid?: string, tyop_name: string, tyop_description?: string }) {
        try {
            const typeOperationValue = new TypeOperationValue({ tyop_uuid, tyop_name, tyop_description });
            const typeOperationCreated = await this.typeOperationRepository.createTypeOperation(typeOperationValue);
            if(!typeOperationCreated) {
                throw new Error(`No se pudo insertar el tipo de operación.`);
            }
            return {
                tyop_uuid: typeOperationCreated.tyop_uuid,
                tyop_name: typeOperationCreated.tyop_name,
                tyop_description: typeOperationCreated.tyop_description,
                tyop_createdat: TimezoneConverter.toIsoStringInTimezone(typeOperationCreated.tyop_createdat, 'America/Buenos_Aires'),
                tyop_updatedat: TimezoneConverter.toIsoStringInTimezone(typeOperationCreated.tyop_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createTypeOperation (use case):', error.message);
            throw error;
        }
    }

    public async updateTypeOperation(tyop_uuid: string, { tyop_name, tyop_description } : { tyop_name: string, tyop_description: string }) {
        try {
            const typeOperationUpdated = await this.typeOperationRepository.updateTypeOperation(tyop_uuid, { tyop_name, tyop_description });
            if(!typeOperationUpdated) {
                throw new Error(`No se pudo actualizar el tipo de operación.`);
            }
            return {
                tyop_uuid: typeOperationUpdated.tyop_uuid,
                tyop_name: typeOperationUpdated.tyop_name,
                tyop_description: typeOperationUpdated.tyop_description,
                tyop_createdat: TimezoneConverter.toIsoStringInTimezone(typeOperationUpdated.tyop_createdat, 'America/Buenos_Aires'),
                tyop_updatedat: TimezoneConverter.toIsoStringInTimezone(typeOperationUpdated.tyop_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateTypeOperation (use case):', error.message);
            throw error;
        }
    }

    public async deleteTypeOperation(tyop_uuid: string) {
        try {
            const typeOperationDeleted = await this.typeOperationRepository.deleteTypeOperation(tyop_uuid);
            if(!typeOperationDeleted) {
                throw new Error(`No se pudo eliminar el tipo de operación.`);
            }
            return {
                tyop_uuid: typeOperationDeleted.tyop_uuid,
                tyop_name: typeOperationDeleted.tyop_name,
                tyop_description: typeOperationDeleted.tyop_description,
                tyop_createdat: TimezoneConverter.toIsoStringInTimezone(typeOperationDeleted.tyop_createdat, 'America/Buenos_Aires'),
                tyop_updatedat: TimezoneConverter.toIsoStringInTimezone(typeOperationDeleted.tyop_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteTypeOperation (use case):', error.message);
            throw error;
        }
    }

    public async findTypeOperationByName(tyop_name: string, excludeUuid?: string) {
        try {
            const typeOperation = await this.typeOperationRepository.findTypeOperationByName(tyop_name, excludeUuid)
            if(typeOperation) {
                throw new Error(`Ya existe un tipo de operación con el nombre ${tyop_name}.`);
            }
            return typeOperation
        } catch (error: any) {
            console.error('Error en findTypeOperationByName (use case):', error.message);
            throw error;
        }
    }
}