module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adiciona campo para saber quando o corte foi finalizado
    await queryInterface.addColumn('appointments', 'finished_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Adiciona campo para observações do cliente
    await queryInterface.addColumn('appointments', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Adiciona campo para travar o preço no momento da finalização (Histórico Financeiro)
    await queryInterface.addColumn('appointments', 'total_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('appointments', 'finished_at');
    await queryInterface.removeColumn('appointments', 'notes');
    await queryInterface.removeColumn('appointments', 'total_price');
  },
};