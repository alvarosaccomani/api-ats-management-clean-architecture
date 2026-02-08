import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { VoucherEntity } from "../../../domain/voucher/voucher.entity";
import { SequelizeTypeOperation } from '../type-operation/type-operation.model';
import { SequelizeVoucherState } from '../voucher-state/voucher-state.model';

export class SequelizeVoucher extends Model<VoucherEntity, Omit<VoucherEntity, 'id'>> {
  declare usr_uuid: string;
  declare crd_uuid: string;
  declare per_uuid: string;
  declare vou_uuid: string;
  declare vou_authorizationnumber: string;
  declare vou_transactionnumber: string;
  declare vou_datetime: Date;
  declare vou_amount: number;
  declare vou_currency: string;
  declare vou_commercename: string;
  declare vou_commercecuit: string;
  declare vou_commercecategory: string;
  declare tyop_uuid: string;
  declare vou_installments: boolean;
  declare vou_installmentcount: number;
  declare vou_installmentinterest: number;
  declare vou_poscode: string;
  declare vou_reference: string;
  declare vous_uuid: string;
  declare vou_image: string;
  declare vou_notes: string;
  declare vou_createdat: Date;
  declare vou_updatedat: Date;
}

SequelizeVoucher.init({
  usr_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  crd_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  per_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  vou_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  vou_authorizationnumber: {
    type: DataTypes.STRING(12),
    allowNull: false
  },
  vou_transactionnumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  vou_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  vou_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  vou_currency: {
    type: DataTypes.STRING(3),
    allowNull: true,
    defaultValue: 'ARS'
  },
  vou_commercename: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  vou_commercecuit: {
    type: DataTypes.STRING(13),
    allowNull: true
  },
  vou_commercecategory: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tyop_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vou_installments: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  vou_installmentcount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  },
  vou_installmentinterest: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  },
  vou_poscode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  vou_reference: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  vous_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vou_image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vou_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vou_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  vou_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'vou_createdat',
  updatedAt: 'vou_updatedat',
  tableName: 'vou_vouchers'
});

//Sequelize Type Operation Foreign Key
SequelizeVoucher.belongsTo(SequelizeTypeOperation, {
    foreignKey: 'tyop_uuid',
    targetKey: "tyop_uuid",
    as: 'tyop'
});

//Sequelize Voucher State Foreign Key
SequelizeVoucher.belongsTo(SequelizeVoucherState, {
    foreignKey: 'vous_uuid',
    targetKey: "vous_uuid",
    as: 'vous'
});