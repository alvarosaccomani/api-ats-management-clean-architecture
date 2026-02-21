import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { BankEntity } from "../../../domain/bank/bank.entity";

export class SequelizeBank extends Model<BankEntity, Omit<BankEntity, 'id'>> {
  declare usr_uuid: string;
  declare ban_uuid: string;
  declare ban_name: string;
  declare ban_description: string;
  declare ban_createdat: Date;
  declare ban_updatedat: Date;
}

SequelizeBank.init({
  usr_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  ban_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  ban_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  ban_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ban_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ban_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'ban_createdat',
  updatedAt: 'ban_updatedat',
  tableName: 'ban_banks'
});