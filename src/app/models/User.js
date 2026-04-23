import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'users',
      }
    );

    // O return this PRECISA estar dentro do init
    return this;
  }

  // O associate PRECISA estar dentro da classe (antes da última chave)
  static associate(models) {
    // Relacionamento: Um usuário pode ter vários agendamentos
    this.hasMany(models.Appointment, {
      foreignKey: 'user_id',
      as: 'appointments',
    });
  }
}

export default User;