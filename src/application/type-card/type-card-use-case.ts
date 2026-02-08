import { TypeCardRepository } from "../../domain/type-card/type-card.repository";
import { TypeCardValue } from "../../domain/type-card/type-card.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class TypeCardUseCase {
    constructor(
        private readonly typeCardRepository: TypeCardRepository
    ) {
        this.getTypeCards = this.getTypeCards.bind(this);
        this.getDetailTypeCard = this.getDetailTypeCard.bind(this);
        this.createTypeCard = this.createTypeCard.bind(this);
        this.updateTypeCard = this.updateTypeCard.bind(this);
        this.deleteTypeCard = this.deleteTypeCard.bind(this);
        this.findTypeCardByName = this.findTypeCardByName.bind(this);
    }

    public async getTypeCards() {
        try {
            const typeCards = await this.typeCardRepository.getTypeCards();
            if(!typeCards) {
                throw new Error('No hay tipos de tarjetas.');
            }
            return typeCards.map(typeCard => ({
                tycrd_uuid: typeCard.tycrd_uuid,
                tycrd_name: typeCard.tycrd_name,
                tycrd_description: typeCard.tycrd_description,
                tycrd_createdat: TimezoneConverter.toIsoStringInTimezone(typeCard.tycrd_createdat, 'America/Buenos_Aires'),
                tycrd_updatedat: TimezoneConverter.toIsoStringInTimezone(typeCard.tycrd_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getTypeCards (use case):', error.message);
            throw error;
        }
    }

    public async getDetailTypeCard(tycrd_uuid: string) {
        try {
            const typeCard = await this.typeCardRepository.findTypeCardById(tycrd_uuid);
            if(!typeCard) {
                throw new Error(`No hay tipo de tarjeta con el Id: ${tycrd_uuid}`);
            }
            return {
                tycrd_uuid: typeCard.tycrd_uuid,
                tycrd_name: typeCard.tycrd_name,
                tycrd_description: typeCard.tycrd_description,
                tycrd_createdat: TimezoneConverter.toIsoStringInTimezone(typeCard.tycrd_createdat, 'America/Buenos_Aires'),
                tycrd_updatedat: TimezoneConverter.toIsoStringInTimezone(typeCard.tycrd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailTypeCard (use case):', error.message);
            throw error;
        }
    }
    
    public async createTypeCard({ tycrd_uuid, tycrd_name, tycrd_description } : { tycrd_uuid?: string, tycrd_name: string, tycrd_description?: string }) {
        try {
            const typeCardValue = new TypeCardValue({ tycrd_uuid, tycrd_name, tycrd_description });
            const typeCardCreated = await this.typeCardRepository.createTypeCard(typeCardValue);
            if(!typeCardCreated) {
                throw new Error(`No se pudo insertar el tipo de tarjeta.`);
            }
            return {
                tycrd_uuid: typeCardCreated.tycrd_uuid,
                tycrd_name: typeCardCreated.tycrd_name,
                tycrd_description: typeCardCreated.tycrd_description,
                tycrd_createdat: TimezoneConverter.toIsoStringInTimezone(typeCardCreated.tycrd_createdat, 'America/Buenos_Aires'),
                tycrd_updatedat: TimezoneConverter.toIsoStringInTimezone(typeCardCreated.tycrd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createTypeCard (use case):', error.message);
            throw error;
        }
    }

    public async updateTypeCard(tycrd_uuid: string, { tycrd_name, tycrd_description } : { tycrd_name: string, tycrd_description: string }) {
        try {
            const typeCardUpdated = await this.typeCardRepository.updateTypeCard(tycrd_uuid, { tycrd_name, tycrd_description });
            if(!typeCardUpdated) {
                throw new Error(`No se pudo actualizar el tipo de tarjeta.`);
            }
            return {
                tycrd_uuid: typeCardUpdated.tycrd_uuid,
                tycrd_name: typeCardUpdated.tycrd_name,
                tycrd_description: typeCardUpdated.tycrd_description,
                tycrd_createdat: TimezoneConverter.toIsoStringInTimezone(typeCardUpdated.tycrd_createdat, 'America/Buenos_Aires'),
                tycrd_updatedat: TimezoneConverter.toIsoStringInTimezone(typeCardUpdated.tycrd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateTypeCard (use case):', error.message);
            throw error;
        }
    }

    public async deleteTypeCard(tycrd_uuid: string) {
        try {
            const typeCardDeleted = await this.typeCardRepository.deleteTypeCard(tycrd_uuid);
            if(!typeCardDeleted) {
                throw new Error(`No se pudo eliminar el tipo de tarjeta.`);
            }
            return {
                tycrd_uuid: typeCardDeleted.tycrd_uuid,
                tycrd_name: typeCardDeleted.tycrd_name,
                tycrd_description: typeCardDeleted.tycrd_description,
                tycrd_createdat: TimezoneConverter.toIsoStringInTimezone(typeCardDeleted.tycrd_createdat, 'America/Buenos_Aires'),
                tycrd_updatedat: TimezoneConverter.toIsoStringInTimezone(typeCardDeleted.tycrd_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteTypeCard (use case):', error.message);
            throw error;
        }
    }

    public async findTypeCardByName(tycrd_name: string, excludeUuid?: string) {
        try {
            const typeCard = await this.typeCardRepository.findTypeCardByName(tycrd_name, excludeUuid)
            if(typeCard) {
                throw new Error(`Ya existe un tipo de tarjeta con el nombre ${tycrd_name}.`);
            }
            return typeCard
        } catch (error: any) {
            console.error('Error en findTypeCardByName (use case):', error.message);
            throw error;
        }
    }
}