import Sequelize, { Model } from 'sequelize';

class Service extends Model {
  static init(sequelize) {
    super.init(
      {
        // VOCÊ PRECISA ADICIONAR ISSO AQUI:
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        price: Sequelize.DECIMAL(10, 2), // Combinando com a Migration
        duration: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'services',
      }
    );

    return this;
  }
  static associate(models) {
  this.hasMany(models.Appointment, {
    foreignKey: 'service_id',
    as: 'appointments',
  });
}
}

export default Service;