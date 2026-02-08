import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { TypeOperationEntity } from "../../../domain/type-operation/type-operation.entity";

export class SequelizeTypeOperation extends Model<TypeOperationEntity, Omit<TypeOperationEntity, 'id'>> {
  declare tyop_uuid: string;
  declare tyop_name: string;
  declare tyop_description: string;
  declare tyop_createdat: Date;
  declare tyop_updatedat: Date;
}

SequelizeTypeOperation.init({
  tyop_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  tyop_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  tyop_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tyop_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tyop_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'tyop_createdat',
  updatedAt: 'tyop_updatedat',
  tableName: 'tyop_typesoperations'
});