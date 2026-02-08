import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { VoucherStateEntity } from "../../../domain/voucher-state/voucher-state.entity";

export class SequelizeVoucherState extends Model<VoucherStateEntity, Omit<VoucherStateEntity, 'id'>> {
  declare vous_uuid: string;
  declare vous_name: string;
  declare vous_description: string;
  declare vous_createdat: Date;
  declare vous_updatedat: Date;
}

SequelizeVoucherState.init({
  vous_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  vous_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  vous_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vous_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  vous_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'vous_createdat',
  updatedAt: 'vous_updatedat',
  tableName: 'vous_voucherstates'
});