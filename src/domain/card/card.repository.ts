import { CardEntity, CardUpdateData } from "./card.entity";

export interface CardRepository {
    getCards(usr_uuid: string): Promise<CardEntity[] | null>;
    findCardById(usr_uuid: string, crd_uuid: string): Promise<CardEntity | null>;
    createCard(card: CardEntity): Promise<CardEntity | null>;
    updateCard(usr_uuid: string, crd_uuid: string, card: CardUpdateData): Promise<CardEntity | null>;
    deleteCard(usr_uuid: string, crd_uuid: string): Promise<CardEntity | null>;
    findCardByMaskedNumber(usr_uuid: string, crd_maskedcardnumber: string, excludeUuid?: string | null): Promise<CardEntity | null>;
}