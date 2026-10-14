import { CardRepository } from "../../domain/card/card.repository";
import { CardValue } from "../../domain/card/card.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class CardUseCase {
    constructor(
        private readonly cardRepository: CardRepository
    ) {
        this.getCards = this.getCards.bind(this);
        this.getDetailCard = this.getDetailCard.bind(this);
        this.createCard = this.createCard.bind(this);
        this.updateCard = this.updateCard.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.findCardByMaskedNumber = this.findCardByMaskedNumber.bind(this);
    }

    public async getCards(usr_uuid: string, scp_uuid?: string) {
        try {
            const cards = await this.cardRepository.getCards(usr_uuid, scp_uuid);
            if(!cards) {
                throw new Error('No hay tarjetas.');
            }
            return cards.map(card => ({
                usr_uuid: card.usr_uuid,
                crd_uuid: card.crd_uuid,
                scp_uuid: card.scp_uuid,
                scp: card.scp,
                crd_alias: card.crd_alias,
                crd_cardholdername: card.crd_cardholdername,
                crd_maskedcardnumber: card.crd_maskedcardnumber,
                crd_last4digits: card.crd_last4digits,
                tycrd_uuid: card.tycrd_uuid,
                tycrd: card.tycrd,
                brcrd_uuid: card.brcrd_uuid,
                brcrd: card.brcrd,
                ban_uuid: card.ban_uuid,
                ban: card.ban,
                crd_expirationdate: card.crd_expirationdate,
                crd_creditlimit: card.crd_creditlimit,
                crd_active: card.crd_active,
                crd_allowdelegation: card.crd_allowdelegation ?? false,
                crd_createdat: TimezoneConverter.toIsoStringInTimezone(card.crd_createdat, 'America/Buenos_Aires'),
                crd_updatedat: TimezoneConverter.toIsoStringInTimezone(card.crd_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getCards (use case):', error.message);
            throw error;
        }
    }

    public async getDetailCard(usr_uuid: string, crd_uuid: string) {
        try {
            const card = await this.cardRepository.findCardById(usr_uuid, crd_uuid);
            if(!card) {
                throw new Error(`No hay tarjeta con el Id: ${crd_uuid}`);
            }
            return {
                usr_uuid: card.usr_uuid,
                crd_uuid: card.crd_uuid,
                scp_uuid: card.scp_uuid,
                scp: card.scp,
                crd_alias: card.crd_alias,
                crd_cardholdername: card.crd_cardholdername,
                crd_maskedcardnumber: card.crd_maskedcardnumber,
                crd_last4digits: card.crd_last4digits,
                tycrd_uuid: card.tycrd_uuid,
                brcrd_uuid: card.brcrd_uuid,
                ban_uuid: card.ban_uuid,
                crd_expirationdate: card.crd_expirationdate,
                crd_creditlimit: card.crd_creditlimit,
                crd_active: card.crd_active,
                crd_allowdelegation: card.crd_allowdelegation ?? false,
                crd_createdat: TimezoneConverter.toIsoStringInTimezone(card.crd_createdat, 'America/Buenos_Aires'),
                crd_updatedat: TimezoneConverter.toIsoStringInTimezone(card.crd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailCard (use case):', error.message);
            throw error;
        }
    }
    
    public async createCard({ 
        usr_uuid, 
        crd_uuid, 
        scp_uuid,
        crd_alias,
        crd_cardholdername,
        crd_maskedcardnumber, 
        crd_last4digits, 
        tycrd_uuid, 
        brcrd_uuid, 
        ban_uuid, 
        crd_expirationdate, 
        crd_creditlimit, 
        crd_active,
        crd_allowdelegation
    } : { 
        usr_uuid: string,
        crd_uuid?: string,
        scp_uuid?: string | null,
        crd_alias?: string | null,
        crd_cardholdername?: string | null,
        crd_maskedcardnumber: string,
        crd_last4digits: string,
        tycrd_uuid: string,
        brcrd_uuid: string,
        ban_uuid: string,
        crd_expirationdate: Date,
        crd_creditlimit?: number | null,
        crd_active?: boolean,
        crd_allowdelegation?: boolean
    }) {
        try {
            const cardValue = new CardValue({ 
                usr_uuid, 
                crd_uuid, 
                scp_uuid,
                crd_alias,
                crd_cardholdername,
                crd_maskedcardnumber, 
                crd_last4digits, 
                tycrd_uuid, 
                brcrd_uuid, 
                ban_uuid, 
                crd_expirationdate, 
                crd_creditlimit, 
                crd_active,
                crd_allowdelegation
            });
            const cardCreated = await this.cardRepository.createCard(cardValue);
            if(!cardCreated) {
                throw new Error(`No se pudo insertar la tarjeta.`);
            }
            return {
                usr_uuid: cardCreated.usr_uuid,
                crd_uuid: cardCreated.crd_uuid,
                scp_uuid: cardCreated.scp_uuid,
                crd_alias: cardCreated.crd_alias,
                crd_cardholdername: cardCreated.crd_cardholdername,
                crd_maskedcardnumber: cardCreated.crd_maskedcardnumber,
                crd_last4digits: cardCreated.crd_last4digits,
                tycrd_uuid: cardCreated.tycrd_uuid,
                brcrd_uuid: cardCreated.brcrd_uuid,
                ban_uuid: cardCreated.ban_uuid,
                crd_expirationdate: cardCreated.crd_expirationdate,
                crd_creditlimit: cardCreated.crd_creditlimit,
                crd_active: cardCreated.crd_active,
                crd_allowdelegation: cardCreated.crd_allowdelegation ?? false,
                crd_createdat: TimezoneConverter.toIsoStringInTimezone(cardCreated.crd_createdat, 'America/Buenos_Aires'),
                crd_updatedat: TimezoneConverter.toIsoStringInTimezone(cardCreated.crd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createCard (use case):', error.message);
            throw error;
        }
    }

    public async updateCard(usr_uuid: string, crd_uuid: string, { 
        scp_uuid,
        crd_alias,
        crd_cardholdername,
        crd_maskedcardnumber, 
        crd_last4digits, 
        tycrd_uuid, 
        brcrd_uuid, 
        ban_uuid, 
        crd_expirationdate, 
        crd_creditlimit, 
        crd_active,
        crd_allowdelegation
    } : { 
        scp_uuid?: string | null,
        crd_alias?: string | null,
        crd_cardholdername?: string | null,
        crd_maskedcardnumber: string,
        crd_last4digits: string,
        tycrd_uuid: string,
        brcrd_uuid: string,
        ban_uuid: string,
        crd_expirationdate: Date,
        crd_creditlimit: number | null,
        crd_active: boolean,
        crd_allowdelegation?: boolean
    }) {
        try {
            const cardUpdated = await this.cardRepository.updateCard(usr_uuid, crd_uuid, { 
                scp_uuid,
                crd_alias,
                crd_cardholdername,
                crd_maskedcardnumber, 
                crd_last4digits, 
                tycrd_uuid, 
                brcrd_uuid, 
                ban_uuid, 
                crd_expirationdate, 
                crd_creditlimit, 
                crd_active,
                crd_allowdelegation
            });
            if(!cardUpdated) {
                throw new Error(`No se pudo actualizar la tarjeta.`);
            }
            return {
                usr_uuid: cardUpdated.usr_uuid,
                crd_uuid: cardUpdated.crd_uuid,
                scp_uuid: cardUpdated.scp_uuid,
                crd_alias: cardUpdated.crd_alias,
                crd_cardholdername: cardUpdated.crd_cardholdername,
                crd_maskedcardnumber: cardUpdated.crd_maskedcardnumber,
                crd_last4digits: cardUpdated.crd_last4digits,
                tycrd_uuid: cardUpdated.tycrd_uuid,
                brcrd_uuid: cardUpdated.brcrd_uuid,
                ban_uuid: cardUpdated.ban_uuid,
                crd_expirationdate: cardUpdated.crd_expirationdate,
                crd_creditlimit: cardUpdated.crd_creditlimit,
                crd_active: cardUpdated.crd_active,
                crd_allowdelegation: cardUpdated.crd_allowdelegation ?? false,
                crd_createdat: TimezoneConverter.toIsoStringInTimezone(cardUpdated.crd_createdat, 'America/Buenos_Aires'),
                crd_updatedat: TimezoneConverter.toIsoStringInTimezone(cardUpdated.crd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateCard (use case):', error.message);
            throw error;
        }
    }

    public async deleteCard(usr_uuid: string, crd_uuid: string) {
        try {
            const cardDeleted = await this.cardRepository.deleteCard(usr_uuid, crd_uuid);
            if(!cardDeleted) {
                throw new Error(`No se pudo eliminar la tarjeta.`);
            }
            return {
                usr_uuid: cardDeleted.usr_uuid,
                crd_uuid: cardDeleted.crd_uuid,
                crd_alias: cardDeleted.crd_alias,
                crd_cardholdername: cardDeleted.crd_cardholdername,
                crd_maskedcardnumber: cardDeleted.crd_maskedcardnumber,
                crd_last4digits: cardDeleted.crd_last4digits,
                tycrd_uuid: cardDeleted.tycrd_uuid,
                brcrd_uuid: cardDeleted.brcrd_uuid,
                ban_uuid: cardDeleted.ban_uuid,
                crd_expirationdate: cardDeleted.crd_expirationdate,
                crd_creditlimit: cardDeleted.crd_creditlimit,
                crd_active: cardDeleted.crd_active,
                crd_allowdelegation: cardDeleted.crd_allowdelegation ?? false,
                crd_createdat: TimezoneConverter.toIsoStringInTimezone(cardDeleted.crd_createdat, 'America/Buenos_Aires'),
                crd_updatedat: TimezoneConverter.toIsoStringInTimezone(cardDeleted.crd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteCard (use case):', error.message);
            throw error;
        }
    }

    public async findCardByMaskedNumber(usr_uuid: string, crd_maskedcardnumber: string, excludeUuid?: string) {
        try {
            const card = await this.cardRepository.findCardByMaskedNumber(usr_uuid, crd_maskedcardnumber, excludeUuid)
            if(card) {
                throw new Error(`Ya existe una tarjeta con el número enmascarado ${crd_maskedcardnumber}.`);
            }
            return card
        } catch (error: any) {
            console.error('Error en findCardByMaskedNumber (use case):', error.message);
            throw error;
        }
    }
}