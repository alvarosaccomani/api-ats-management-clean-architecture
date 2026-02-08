import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { TypeCardEntity } from "../../../domain/type-card/type-card.entity";

export class SequelizeTypeCard extends Model<TypeCardEntity, Omit<TypeCardEntity, 'id'>> {
  declare tycrd_uuid: string;
  declare tycrd_name: string;
  declare tycrd_description: string;
  declare tycrd_createdat: Date;
  declare tycrd_updatedat: Date;
}

SequelizeTypeCard.init({
  tycrd_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  tycrd_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  tycrd_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tycrd_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tycrd_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'tycrd_createdat',
  updatedAt: 'tycrd_updatedat',
  tableName: 'tycrd_typecards'
});