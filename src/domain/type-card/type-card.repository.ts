import { TypeCardEntity, TypeCardUpdateData } from "./type-card.entity";

export interface TypeCardRepository {
    getTypeCards(): Promise<TypeCardEntity[] | null>;
    findTypeCardById(tycrd_uuid: string): Promise<TypeCardEntity | null>;
    createTypeCard(typeCard: TypeCardEntity): Promise<TypeCardEntity | null>;
    updateTypeCard(tycrd_uuid: string, typeCard: TypeCardUpdateData): Promise<TypeCardEntity | null>;
    deleteTypeCard(tycrd_uuid: string): Promise<TypeCardEntity | null>;
    findTypeCardByName(tycrd_name: string, excludeUuid?: string | null): Promise<TypeCardEntity | null>;
}