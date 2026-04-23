import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        // 1. Adicionado o ID (fundamental para o Sequelize não dar erro de undefined)
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        // 2. Usando DATE para salvar dia e hora juntos (mais eficiente para agendamento)
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        finished_at: Sequelize.DATE, // ADICIONADO
        notes: Sequelize.TEXT,       // ADICIONADO
        total_price: Sequelize.DECIMAL(10, 2), // ADICIONADO
      },
      {
        sequelize,
        tableName: 'appointments',
      }
    );

    return this;
  }

  static associate(models) {
    // 3. As 3 conexões que você desenhou no Excalidraw:
    
    // O Cliente que agendou
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    
    // O Barbeiro que vai atender
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    
    // O Serviço escolhido (Corte, Barba, etc)
    this.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
  }
}

export default Appointment;