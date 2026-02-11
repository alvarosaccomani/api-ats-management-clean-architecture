import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { PaymentPeriodEntity } from "../../../domain/payment-period/payment-period.entity";
import { SequelizePaymentMethod } from '../payment-method/payment-method.model';
import { SequelizePaymentPeriodStatus } from '../payment-period-status/payment-period-status.model';

export class SequelizePaymentPeriod extends Model<PaymentPeriodEntity, Omit<PaymentPeriodEntity, 'id'>> {
  declare usr_uuid: string;
  declare crd_uuid: string;
  declare per_uuid: string;
  declare payp_uuid: string;
  declare payp_paymentdate: Date;
  declare payp_amountpaid: number;
  declare paym_uuid: string;
  declare payp_paymentreference: string;
  declare payps_uuid: string;
  declare payp_createdat: Date;
  declare payp_updatedat: Date;
}

SequelizePaymentPeriod.init({
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
  payp_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  payp_paymentdate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  payp_amountpaid: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  paym_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payp_paymentreference: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  payps_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payp_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  payp_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'payp_createdat',
  updatedAt: 'payp_updatedat',
  tableName: 'payp_paymentsperiod'
});

//Sequelize Payment Method Foreign Key
SequelizePaymentPeriod.belongsTo(SequelizePaymentMethod, {
    foreignKey: 'paym_uuid',
    targetKey: "paym_uuid",
    as: 'paym'
});

//Sequelize Payment Period Status Foreign Key
SequelizePaymentPeriod.belongsTo(SequelizePaymentPeriodStatus, {
    foreignKey: 'payps_uuid',
    targetKey: "payps_uuid",
    as: 'payps'
});