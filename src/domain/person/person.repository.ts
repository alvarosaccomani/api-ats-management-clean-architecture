import { PersonEntity, PersonUpdateData } from "./person.entity";

export interface PersonRepository {
    getPersons(scp_uuid: string): Promise<PersonEntity[] | null>;
    findPersonById(prs_uuid: string): Promise<PersonEntity | null>;
    createPerson(person: PersonEntity): Promise<PersonEntity | null>;
    updatePerson(prs_uuid: string, person: PersonUpdateData): Promise<PersonEntity | null>;
    deletePerson(prs_uuid: string): Promise<PersonEntity | null>;
    findPersonByName(scp_uuid: string, prs_name: string, excludeUuid?: string | null): Promise<PersonEntity | null>;
}
