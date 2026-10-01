import { Op, Sequelize } from 'sequelize';
import { PersonEntity, PersonUpdateData } from "../../../domain/person/person.entity";
import { PersonRepository } from "../../../domain/person/person.repository";
import { SequelizePerson } from "../../model/person/person.model";

export class SequelizePersonRepository implements PersonRepository {
    async getPersons(scp_uuid: string): Promise<PersonEntity[] | null> {
        try {
            const persons = await SequelizePerson.findAll({
                where: {
                    scp_uuid,
                    prs_active: true
                },
                order: [
                    [Sequelize.col('prs_name'), 'ASC']
                ]
            });
            if (!persons) {
                return [];
            }
            return persons.map(p => p.get({ plain: true }) as PersonEntity);
        } catch (error: any) {
            console.error('Error en getPersons:', error.message);
            throw error;
        }
    }

    async findPersonById(prs_uuid: string): Promise<PersonEntity | null> {
        try {
            const person = await SequelizePerson.findOne({ 
                where: { prs_uuid } 
            });
            if (!person) {
                return null;
            }
            return person.get({ plain: true }) as PersonEntity;
        } catch (error: any) {
            console.error('Error en findPersonById:', error.message);
            throw error;
        }
    }

    async createPerson(person: PersonEntity): Promise<PersonEntity | null> {
        try {
            const { prs_uuid, scp_uuid, usr_uuidlinked, prs_name, prs_type, prs_phone, prs_email, prs_taxid, prs_active, prs_createdat, prs_updatedat } = person;
            const result = await SequelizePerson.create({
                prs_uuid,
                scp_uuid,
                usr_uuidlinked,
                prs_name,
                prs_type: prs_type ?? 'OTRO',
                prs_phone,
                prs_email,
                prs_taxid,
                prs_active: prs_active ?? true,
                prs_createdat,
                prs_updatedat
            });

            if (!result) {
                throw new Error(`No se ha agregado la persona`);
            }
            return result.get({ plain: true }) as PersonEntity;
        } catch (error: any) {
            console.error('Error en createPerson:', error.message);
            throw error;
        }
    }

    async updatePerson(prs_uuid: string, person: PersonUpdateData): Promise<PersonEntity | null> {
        try {
            const [updatedCount, [updatedPerson]] = await SequelizePerson.update(
                {
                    scp_uuid: person.scp_uuid,
                    usr_uuidlinked: person.usr_uuidlinked,
                    prs_name: person.prs_name,
                    prs_type: person.prs_type,
                    prs_phone: person.prs_phone,
                    prs_email: person.prs_email,
                    prs_taxid: person.prs_taxid,
                    prs_active: person.prs_active
                },
                {
                    where: { prs_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado la persona`);
            }
            return updatedPerson.get({ plain: true }) as PersonEntity;
        } catch (error: any) {
            console.error('Error en updatePerson:', error.message);
            throw error;
        }
    }

    async deletePerson(prs_uuid: string): Promise<PersonEntity | null> {
        try {
            const person = await this.findPersonById(prs_uuid);
            const result = await SequelizePerson.destroy({ where: { prs_uuid } });
            if (!result) {
                throw new Error(`No se ha eliminado la persona`);
            }
            return person;
        } catch (error: any) {
            console.error('Error en deletePerson:', error.message);
            throw error;
        }
    }

    async findPersonByName(scp_uuid: string, prs_name: string, excludeUuid?: string | null): Promise<PersonEntity | null> {
        try {
            const whereCondition: any = { scp_uuid, prs_name };
            if (excludeUuid) {
                whereCondition.prs_uuid = { [Op.ne]: excludeUuid };
            }
            const person = await SequelizePerson.findOne({ where: whereCondition });
            return person ? (person.get({ plain: true }) as PersonEntity) : null;
        } catch (error: any) {
            console.error('Error en findPersonByName:', error.message);
            throw error;
        }
    }
}
