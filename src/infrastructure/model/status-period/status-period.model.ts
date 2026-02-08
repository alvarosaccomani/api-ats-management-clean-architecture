import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { StatusPeriodEntity } from "../../../domain/status-period/status-period.entity";

export class SequelizeStatusPeriod extends Model<StatusPeriodEntity, Omit<StatusPeriodEntity, 'id'>> {
  declare sper_uuid: string;
  declare sper_name: string;
  declare sper_description: string;
  declare sper_createdat: Date;
  declare sper_updatedat: Date;
}

SequelizeStatusPeriod.init({
  sper_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  sper_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  sper_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sper_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sper_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'sper_createdat',
  updatedAt: 'sper_updatedat',
  tableName: 'sper_statusperiod'
});