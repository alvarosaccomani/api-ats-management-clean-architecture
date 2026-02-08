import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { PeriodEntity } from "../../../domain/period/period.entity";
import { SequelizeStatusPeriod } from '../status-period/status-period.model';

export class SequelizePeriod extends Model<PeriodEntity, Omit<PeriodEntity, 'id'>> {
  declare usr_uuid: string;
  declare crd_uuid: string;
  declare per_uuid: string;
  declare per_periodnumber: number;
  declare per_startdate: Date;
  declare per_enddate: Date;
  declare per_duedate: Date;
  declare sper_uuid: string;
  declare per_previousbalance: number;
  declare per_interest: number;
  declare per_createdat: Date;
  declare per_updatedat: Date;
}

SequelizePeriod.init({
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
  per_periodnumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  per_startdate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  per_enddate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  per_duedate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  sper_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  per_previousbalance: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },
  per_interest: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },
  per_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  per_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'per_createdat',
  updatedAt: 'per_updatedat',
  tableName: 'per_periods'
});

//Sequelize Status Period Foreign Key
SequelizePeriod.belongsTo(SequelizeStatusPeriod, {
    foreignKey: 'sper_uuid',
    targetKey: "sper_uuid",
    as: 'sper'
});