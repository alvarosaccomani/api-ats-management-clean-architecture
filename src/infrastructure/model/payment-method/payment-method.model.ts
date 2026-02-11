import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { PaymentMethodEntity } from "../../../domain/payment-method/payment-method.entity";

export class SequelizePaymentMethod extends Model<PaymentMethodEntity, Omit<PaymentMethodEntity, 'id'>> {
  declare paym_uuid: string;
  declare paym_name: string;
  declare paym_description: string;
  declare paym_createdat: Date;
  declare paym_updatedat: Date;
}

SequelizePaymentMethod.init({
  paym_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  paym_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  paym_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paym_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paym_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'paym_createdat',
  updatedAt: 'paym_updatedat',
  tableName: 'paym_paymentsmethods'
});