import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { ScopeUserEntity } from "../../../domain/scope-user/scope-user.entity";
import { SequelizeScope } from '../scope/scope.model';
import { SequelizeUser } from '../user/user.model';

export class SequelizeScopeUser extends Model<ScopeUserEntity, Omit<ScopeUserEntity, 'id'>> {
  declare scp_uuid: string;
  declare usr_uuid: string;
  declare scpu_role: string;
  declare scpu_createdat: Date;
}

SequelizeScopeUser.init({
  scp_uuid: {
    type: DataTypes.STRING(40),
    primaryKey: true,
    allowNull: false
  },
  usr_uuid: {
    type: DataTypes.STRING(40),
    primaryKey: true,
    allowNull: false
  },
  scpu_role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'MEMBER'
  },
  scpu_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: false,
  tableName: 'scpu_scopeusers'
});

SequelizeScopeUser.belongsTo(SequelizeScope, {
  foreignKey: 'scp_uuid',
  targetKey: 'scp_uuid',
  as: 'scope'
});

SequelizeScope.hasMany(SequelizeScopeUser, {
  foreignKey: 'scp_uuid',
  sourceKey: 'scp_uuid',
  as: 'members'
});

SequelizeScopeUser.belongsTo(SequelizeUser, {
  foreignKey: 'usr_uuid',
  targetKey: 'usr_uuid',
  as: 'user'
});

SequelizeUser.hasMany(SequelizeScopeUser, {
  foreignKey: 'usr_uuid',
  sourceKey: 'usr_uuid',
  as: 'scopeUsers'
});
