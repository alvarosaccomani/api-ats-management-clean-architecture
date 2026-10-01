import { PersonRepository } from "../../domain/person/person.repository";
import { PersonValue } from "../../domain/person/person.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class PersonUseCase {
    constructor(
        private readonly personRepository: PersonRepository
    ) {
        this.getPersons = this.getPersons.bind(this);
        this.getDetailPerson = this.getDetailPerson.bind(this);
        this.createPerson = this.createPerson.bind(this);
        this.updatePerson = this.updatePerson.bind(this);
        this.deletePerson = this.deletePerson.bind(this);
    }

    public async getPersons(scp_uuid: string) {
        try {
            const persons = await this.personRepository.getPersons(scp_uuid);
            if (!persons) {
                return [];
            }
            return persons.map(person => ({
                prs_uuid: person.prs_uuid,
                scp_uuid: person.scp_uuid,
                usr_uuidlinked: person.usr_uuidlinked,
                prs_name: person.prs_name,
                prs_type: person.prs_type,
                prs_phone: person.prs_phone,
                prs_email: person.prs_email,
                prs_taxid: person.prs_taxid,
                prs_active: person.prs_active,
                prs_createdat: TimezoneConverter.toIsoStringInTimezone(person.prs_createdat, 'America/Buenos_Aires'),
                prs_updatedat: TimezoneConverter.toIsoStringInTimezone(person.prs_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getPersons (use case):', error.message);
            throw error;
        }
    }

    public async getDetailPerson(prs_uuid: string) {
        try {
            const person = await this.personRepository.findPersonById(prs_uuid);
            if (!person) {
                throw new Error(`No hay persona con el Id: ${prs_uuid}`);
            }
            return {
                prs_uuid: person.prs_uuid,
                scp_uuid: person.scp_uuid,
                usr_uuidlinked: person.usr_uuidlinked,
                prs_name: person.prs_name,
                prs_type: person.prs_type,
                prs_phone: person.prs_phone,
                prs_email: person.prs_email,
                prs_taxid: person.prs_taxid,
                prs_active: person.prs_active,
                prs_createdat: TimezoneConverter.toIsoStringInTimezone(person.prs_createdat, 'America/Buenos_Aires'),
                prs_updatedat: TimezoneConverter.toIsoStringInTimezone(person.prs_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailPerson (use case):', error.message);
            throw error;
        }
    }

    public async createPerson({
        prs_uuid,
        scp_uuid,
        usr_uuidlinked,
        prs_name,
        prs_type,
        prs_phone,
        prs_email,
        prs_taxid,
        prs_active
    }: {
        prs_uuid?: string;
        scp_uuid: string;
        usr_uuidlinked?: string | null;
        prs_name: string;
        prs_type?: string;
        prs_phone?: string | null;
        prs_email?: string | null;
        prs_taxid?: string | null;
        prs_active?: boolean;
    }) {
        try {
            const existing = await this.personRepository.findPersonByName(scp_uuid, prs_name);
            if (existing) {
                throw new Error(`Ya existe un contacto con el nombre "${prs_name}".`);
            }
            const personValue = new PersonValue({
                prs_uuid,
                scp_uuid,
                usr_uuidlinked,
                prs_name,
                prs_type,
                prs_phone,
                prs_email,
                prs_taxid,
                prs_active
            });
            const personCreated = await this.personRepository.createPerson(personValue);
            if (!personCreated) {
                throw new Error(`No se pudo insertar la persona.`);
            }
            return {
                prs_uuid: personCreated.prs_uuid,
                scp_uuid: personCreated.scp_uuid,
                usr_uuidlinked: personCreated.usr_uuidlinked,
                prs_name: personCreated.prs_name,
                prs_type: personCreated.prs_type,
                prs_phone: personCreated.prs_phone,
                prs_email: personCreated.prs_email,
                prs_taxid: personCreated.prs_taxid,
                prs_active: personCreated.prs_active,
                prs_createdat: TimezoneConverter.toIsoStringInTimezone(personCreated.prs_createdat, 'America/Buenos_Aires'),
                prs_updatedat: TimezoneConverter.toIsoStringInTimezone(personCreated.prs_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createPerson (use case):', error.message);
            throw error;
        }
    }

    public async updatePerson(prs_uuid: string, {
        scp_uuid,
        usr_uuidlinked,
        prs_name,
        prs_type,
        prs_phone,
        prs_email,
        prs_taxid,
        prs_active
    }: {
        scp_uuid: string;
        usr_uuidlinked?: string | null;
        prs_name: string;
        prs_type: string;
        prs_phone?: string | null;
        prs_email?: string | null;
        prs_taxid?: string | null;
        prs_active: boolean;
    }) {
        try {
            const existing = await this.personRepository.findPersonByName(scp_uuid, prs_name, prs_uuid);
            if (existing) {
                throw new Error(`Ya existe otra persona con el nombre "${prs_name}".`);
            }
            const personUpdated = await this.personRepository.updatePerson(prs_uuid, {
                scp_uuid,
                usr_uuidlinked,
                prs_name,
                prs_type,
                prs_phone,
                prs_email,
                prs_taxid,
                prs_active
            });
            if (!personUpdated) {
                throw new Error(`No se pudo actualizar la persona.`);
            }
            return {
                prs_uuid: personUpdated.prs_uuid,
                scp_uuid: personUpdated.scp_uuid,
                usr_uuidlinked: personUpdated.usr_uuidlinked,
                prs_name: personUpdated.prs_name,
                prs_type: personUpdated.prs_type,
                prs_phone: personUpdated.prs_phone,
                prs_email: personUpdated.prs_email,
                prs_taxid: personUpdated.prs_taxid,
                prs_active: personUpdated.prs_active,
                prs_createdat: TimezoneConverter.toIsoStringInTimezone(personUpdated.prs_createdat, 'America/Buenos_Aires'),
                prs_updatedat: TimezoneConverter.toIsoStringInTimezone(personUpdated.prs_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updatePerson (use case):', error.message);
            throw error;
        }
    }

    public async deletePerson(prs_uuid: string) {
        try {
            const personDeleted = await this.personRepository.deletePerson(prs_uuid);
            if (!personDeleted) {
                throw new Error(`No se pudo eliminar la persona.`);
            }
            return {
                prs_uuid: personDeleted.prs_uuid,
                scp_uuid: personDeleted.scp_uuid,
                usr_uuidlinked: personDeleted.usr_uuidlinked,
                prs_name: personDeleted.prs_name,
                prs_type: personDeleted.prs_type,
                prs_phone: personDeleted.prs_phone,
                prs_email: personDeleted.prs_email,
                prs_taxid: personDeleted.prs_taxid,
                prs_active: personDeleted.prs_active,
                prs_createdat: TimezoneConverter.toIsoStringInTimezone(personDeleted.prs_createdat, 'America/Buenos_Aires'),
                prs_updatedat: TimezoneConverter.toIsoStringInTimezone(personDeleted.prs_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deletePerson (use case):', error.message);
            throw error;
        }
    }
}
