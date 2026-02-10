import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { VoucherFeeStatusEntity } from "../../../domain/voucher-fee-status/voucher-fee-status.entity";

export class SequelizeVoucherFeeStatus extends Model<VoucherFeeStatusEntity, Omit<VoucherFeeStatusEntity, 'id'>> {
  declare voufs_uuid: string;
  declare voufs_name: string;
  declare voufs_description: string;
  declare voufs_createdat: Date;
  declare voufs_updatedat: Date;
}

SequelizeVoucherFeeStatus.init({
  voufs_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  voufs_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  voufs_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  voufs_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  voufs_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'voufs_createdat',
  updatedAt: 'voufs_updatedat',
  tableName: 'voufs_vouchersfeestatus'
});