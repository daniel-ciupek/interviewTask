export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Messages', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    message: { type: Sequelize.STRING(500), allowNull: false },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
  });
}
export async function down(queryInterface) {
  await queryInterface.dropTable('Messages');
}
