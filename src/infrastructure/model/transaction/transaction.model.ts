import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { TransactionEntity } from "../../../domain/transaction/transaction.entity";
import { SequelizeScope } from '../scope/scope.model';
import { SequelizePerson } from '../person/person.model';

export class SequelizeTransaction extends Model<TransactionEntity, Omit<TransactionEntity, 'id'>> {
  declare trx_uuid: string;
  declare scp_uuid: string;
  declare usr_uuidcreator: string;
  declare trx_type: string;
  declare trx_datetime: Date;
  declare trx_amount: number;
  declare trx_currency: string;
  declare crd_uuid?: string | null;
  declare target_crduuid?: string | null;
  declare trx_concept: string;
  declare prs_uuid?: string | null;
  declare prs_uuidactor?: string | null;
  declare trx_commissionrate?: number | null;
  declare trx_commissionamount?: number | null;
  declare trx_notes?: string | null;
  declare trx_createdat: Date;
  declare trx_updatedat: Date;
}

SequelizeTransaction.init({
  trx_uuid: {
    type: DataTypes.STRING(40),
    primaryKey: true,
    allowNull: false
  },
  scp_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  usr_uuidcreator: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  trx_type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  trx_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  trx_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.00
  },
  trx_currency: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'ARS'
  },
  crd_uuid: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  target_crduuid: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  trx_concept: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  prs_uuid: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  prs_uuidactor: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  trx_commissionrate: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  trx_commissionamount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  trx_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trx_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  trx_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'trx_createdat',
  updatedAt: 'trx_updatedat',
  tableName: 'trx_transactions'
});

SequelizeTransaction.belongsTo(SequelizeScope, {
  foreignKey: 'scp_uuid',
  targetKey: 'scp_uuid',
  as: 'scp'
});

SequelizeTransaction.belongsTo(SequelizePerson, {
  foreignKey: 'prs_uuid',
  targetKey: 'prs_uuid',
  as: 'prs'
});

SequelizeTransaction.belongsTo(SequelizePerson, {
  foreignKey: 'prs_uuidactor',
  targetKey: 'prs_uuid',
  as: 'actor'
});
