import { TypeOperationEntity, TypeOperationUpdateData } from "./type-operation.entity";

export interface TypeOperationRepository {
    getTypeOperations(): Promise<TypeOperationEntity[] | null>;
    findTypeOperationById(tyop_uuid: string): Promise<TypeOperationEntity | null>;
    createTypeOperation(typeOperation: TypeOperationEntity): Promise<TypeOperationEntity | null>;
    updateTypeOperation(tyop_uuid: string, typeOperation: TypeOperationUpdateData): Promise<TypeOperationEntity | null>;
    deleteTypeOperation(tyop_uuid: string): Promise<TypeOperationEntity | null>;
    findTypeOperationByName(tyop_name: string, excludeUuid?: string | null): Promise<TypeOperationEntity | null>;
}