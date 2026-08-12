import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { PendingVoucherEntity } from "../../../domain/pending-voucher/pending-voucher.entity";

export class SequelizePendingVoucher extends Model<PendingVoucherEntity, Omit<PendingVoucherEntity, 'id'>> {
  declare usr_uuid: string;
  declare pevou_uuid: string;
  declare pevou_name: string;
  declare pevou_image: string;
  declare pevou_unreadcontent: string;
  declare pevou_unreadtext: string;
  declare pevou_createdat: Date;
  declare pevou_updatedat: Date;
}

SequelizePendingVoucher.init({
  usr_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  pevou_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  pevou_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  pevou_image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pevou_unreadcontent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pevou_unreadtext: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pevou_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pevou_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'pevou_createdat',
  updatedAt: 'pevou_updatedat',
  tableName: 'pevou_pendingvouchers'
});