import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { ScopeEntity } from "../../../domain/scope/scope.entity";

export class SequelizeScope extends Model<ScopeEntity, Omit<ScopeEntity, 'id'>> {
  declare scp_uuid: string;
  declare scp_name: string;
  declare scp_description?: string | null;
  declare scp_isshared: boolean;
  declare scp_color?: string | null;
  declare scp_icon?: string | null;
  declare usr_uuidowner: string;
  declare scp_active: boolean;
  declare scp_createdat: Date;
  declare scp_updatedat: Date;
}

SequelizeScope.init({
  scp_uuid: {
    type: DataTypes.STRING(40),
    primaryKey: true,
    allowNull: false
  },
  scp_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  scp_description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  scp_isshared: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  scp_color: {
    type: DataTypes.STRING(30),
    allowNull: true,
    defaultValue: '#1890ff'
  },
  scp_icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'wallet'
  },
  usr_uuidowner: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  scp_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  scp_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  scp_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'scp_createdat',
  updatedAt: 'scp_updatedat',
  tableName: 'scp_scopes'
});
