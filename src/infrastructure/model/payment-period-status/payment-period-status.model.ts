import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { PaymentPeriodStatusEntity } from "../../../domain/payment-period-status/payment-period-status.entity";

export class SequelizePaymentPeriodStatus extends Model<PaymentPeriodStatusEntity, Omit<PaymentPeriodStatusEntity, 'id'>> {
  declare payps_uuid: string;
  declare payps_name: string;
  declare payps_description: string;
  declare payps_createdat: Date;
  declare payps_updatedat: Date;
}

SequelizePaymentPeriodStatus.init({
  payps_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  payps_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  payps_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  payps_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  payps_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'payps_createdat',
  updatedAt: 'payps_updatedat',
  tableName: 'payps_paymentsperiodstatus'
});