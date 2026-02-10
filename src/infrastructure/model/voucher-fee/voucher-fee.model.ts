import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { VoucherFeeEntity } from "../../../domain/voucher-fee/voucher-fee.entity";
import { SequelizeVoucherFeeStatus } from '../voucher-fee-status/voucher-fee-status.model';

export class SequelizeVoucherFee extends Model<VoucherFeeEntity, Omit<VoucherFeeEntity, 'id'>> {
  declare usr_uuid: string;
  declare crd_uuid: string;
  declare per_uuid: string;
  declare vou_uuid: string;
  declare vouf_uuid: string;
  declare vouf_quotanumber: number;
  declare vouf_quotaamount: number;
  declare vouf_quotaduedate: Date;
  declare voufs_uuid: string;
  declare vouf_createdat: Date;
  declare vouf_updatedat: Date;
}

SequelizeVoucherFee.init({
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
  vouf_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  vouf_quotanumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vouf_quotaamount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  vouf_quotaduedate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  voufs_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vouf_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  vouf_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'vouf_createdat',
  updatedAt: 'vouf_updatedat',
  tableName: 'vouf_voucherfees'
});

//Sequelize Voucher Fee Status Foreign Key
SequelizeVoucherFee.belongsTo(SequelizeVoucherFeeStatus, {
    foreignKey: 'voufs_uuid',
    targetKey: "voufs_uuid",
    as: 'voufs'
});