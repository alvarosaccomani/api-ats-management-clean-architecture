import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { FixedExpenseEntity } from "../../../domain/fixed-expense/fixed-expense.entity";
import { SequelizeScope } from '../scope/scope.model';
import { SequelizePerson } from '../person/person.model';
import { SequelizeCard } from '../card/card.model';
import { SequelizeTransaction } from '../transaction/transaction.model';

export class SequelizeFixedExpense extends Model<FixedExpenseEntity, Omit<FixedExpenseEntity, 'id'>> {
  declare fex_uuid: string;
  declare scp_uuid: string;
  declare usr_uuid: string;
  declare fex_name: string;
  declare fex_category?: string | null;
  declare fex_dueday: number;
  declare fex_referenceamount?: number | null;
  declare fex_currency: string;
  declare crd_uuid?: string | null;
  declare prs_uuid?: string | null;
  declare prs_uuidactor?: string | null;
  declare fex_isautodebit: boolean;
  declare fex_autogenerate: boolean;
  declare fex_active: boolean;
  declare fex_notes?: string | null;
  declare fex_createdat: Date;
  declare fex_updatedat: Date;
}

SequelizeFixedExpense.init({
  fex_uuid: {
    type: DataTypes.STRING(40),
    primaryKey: true,
    allowNull: false
  },
  scp_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  usr_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  fex_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  fex_category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'SERVICIOS'
  },
  fex_dueday: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  fex_referenceamount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0.00
  },
  fex_currency: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'ARS'
  },
  crd_uuid: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  prs_uuid: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  prs_uuidactor: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  fex_isautodebit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  fex_autogenerate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  fex_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  fex_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fex_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fex_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: false,
  tableName: 'fex_fixedexpenses'
});

SequelizeFixedExpense.belongsTo(SequelizeScope, {
  foreignKey: 'scp_uuid',
  targetKey: 'scp_uuid',
  as: 'scope'
});

SequelizeFixedExpense.belongsTo(SequelizePerson, {
  foreignKey: 'prs_uuid',
  targetKey: 'prs_uuid',
  as: 'supplier'
});

SequelizeFixedExpense.belongsTo(SequelizePerson, {
  foreignKey: 'prs_uuidactor',
  targetKey: 'prs_uuid',
  as: 'actor'
});

SequelizeFixedExpense.belongsTo(SequelizeCard, {
  foreignKey: 'crd_uuid',
  targetKey: 'crd_uuid',
  as: 'card'
});

SequelizeFixedExpense.hasMany(SequelizeTransaction, {
  foreignKey: 'fex_uuid',
  sourceKey: 'fex_uuid',
  as: 'transactions'
});

SequelizeTransaction.belongsTo(SequelizeFixedExpense, {
  foreignKey: 'fex_uuid',
  targetKey: 'fex_uuid',
  as: 'fixedExpense'
});
