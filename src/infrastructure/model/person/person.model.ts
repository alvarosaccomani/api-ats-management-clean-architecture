import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { PersonEntity } from "../../../domain/person/person.entity";
import { SequelizeScope } from '../scope/scope.model';

export class SequelizePerson extends Model<PersonEntity, Omit<PersonEntity, 'id'>> {
  declare prs_uuid: string;
  declare scp_uuid: string;
  declare usr_uuidlinked?: string | null;
  declare prs_name: string;
  declare prs_type: string;
  declare prs_phone?: string | null;
  declare prs_email?: string | null;
  declare prs_taxid?: string | null;
  declare prs_active: boolean;
  declare prs_createdat: Date;
  declare prs_updatedat: Date;
}

SequelizePerson.init({
  prs_uuid: {
    type: DataTypes.STRING(40),
    primaryKey: true,
    allowNull: false
  },
  scp_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  usr_uuidlinked: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  prs_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  prs_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'OTRO'
  },
  prs_phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  prs_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  prs_taxid: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  prs_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  prs_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  prs_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'prs_createdat',
  updatedAt: 'prs_updatedat',
  tableName: 'prs_persons'
});

SequelizePerson.belongsTo(SequelizeScope, {
  foreignKey: 'scp_uuid',
  targetKey: 'scp_uuid',
  as: 'scope'
});
