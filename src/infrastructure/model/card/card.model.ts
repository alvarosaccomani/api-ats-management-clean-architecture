import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { CardEntity } from "../../../domain/card/card.entity";
import { SequelizeTypeCard } from '../type-card/type-card.model';
import { SequelizeBrandCard } from '../brand-card/brand-card.model';
import { SequelizeBank } from '../bank/bank.model';
import { SequelizePeriod } from '../period/period.model';
import { BrandCardEntity } from '../../../domain/brand-card/brand-card.entity';
import { TypeCardEntity } from '../../../domain/type-card/type-card.entity';
import { BankEntity } from '../../../domain/bank/bank.entity';
import { SequelizeScope } from '../scope/scope.model';

export class SequelizeCard extends Model<CardEntity, Omit<CardEntity, 'id'>> {
  declare usr_uuid: string;
  declare crd_uuid: string;
  declare scp_uuid?: string | null;
  declare scp?: SequelizeScope;
  declare crd_alias?: string | null;
  declare crd_cardholdername?: string | null;
  declare crd_maskedcardnumber?: string | null;
  declare crd_last4digits?: string | null;
  declare tycrd_uuid: string;
  declare tycrd?: TypeCardEntity;
  declare brcrd_uuid?: string | null;
  declare brcrd?: BrandCardEntity;
  declare ban_uuid?: string | null;
  declare ban?: BankEntity;
  declare crd_expirationdate?: Date | null;
  declare crd_creditlimit: number | null;
  declare crd_cbucvu?: string | null;
  declare crd_cbualias?: string | null;
  declare crd_active: boolean;
  declare crd_allowdelegation: boolean;
  declare crd_createdat: Date;
  declare crd_updatedat: Date;
  declare periods?: SequelizePeriod[];
}

SequelizeCard.init({
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
  scp_uuid: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  crd_alias: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  crd_cardholdername: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  crd_maskedcardnumber: {
    type: DataTypes.STRING(19),
    allowNull: true
  },
  crd_last4digits: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  tycrd_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brcrd_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ban_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  crd_expirationdate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  crd_creditlimit: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  crd_cbucvu: {
    type: DataTypes.STRING(22),
    allowNull: true
  },
  crd_cbualias: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  crd_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  crd_allowdelegation: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  crd_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  crd_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'crd_createdat',
  updatedAt: 'crd_updatedat',
  tableName: 'crd_cards'
});

//Sequelize Type Card Foreign Key
SequelizeCard.belongsTo(SequelizeTypeCard, {
    foreignKey: 'tycrd_uuid',
    targetKey: "tycrd_uuid",
    as: 'tycrd'
});

//Sequelize Brand Card Foreign Key
SequelizeCard.belongsTo(SequelizeBrandCard, {
    foreignKey: 'brcrd_uuid',
    targetKey: "brcrd_uuid",
    as: 'brcrd'
});

//Sequelize Bank Foreign Key
SequelizeCard.hasMany(SequelizeBank, {
    foreignKey: 'usr_uuid',
    sourceKey: 'usr_uuid'
});
SequelizeCard.belongsTo(SequelizeBank, {
    foreignKey: 'ban_uuid',
    targetKey: "ban_uuid",
    as: 'ban'
});

// Sequelize Period Foreign Key
SequelizeCard.hasMany(SequelizePeriod, {
  foreignKey: 'usr_uuid',
  sourceKey: 'usr_uuid',
});

SequelizeCard.hasMany(SequelizePeriod, {
  foreignKey: 'crd_uuid',
  sourceKey: 'crd_uuid',
  as: 'periods'
});

// Sequelize Scope Foreign Key
SequelizeCard.belongsTo(SequelizeScope, {
  foreignKey: 'scp_uuid',
  targetKey: 'scp_uuid',
  as: 'scp'
});