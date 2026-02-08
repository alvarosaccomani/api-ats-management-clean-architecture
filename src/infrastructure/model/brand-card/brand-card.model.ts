import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { BrandCardEntity } from "../../../domain/brand-card/brand-card.entity";

export class SequelizeBrandCard extends Model<BrandCardEntity, Omit<BrandCardEntity, 'id'>> {
  declare brcrd_uuid: string;
  declare brcrd_name: string;
  declare brcrd_description: string;
  declare brcrd_createdat: Date;
  declare brcrd_updatedat: Date;
}

SequelizeBrandCard.init({
  brcrd_uuid: {
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  brcrd_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  brcrd_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  brcrd_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  brcrd_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'brcrd_createdat',
  updatedAt: 'brcrd_updatedat',
  tableName: 'brcrd_brandcards'
});