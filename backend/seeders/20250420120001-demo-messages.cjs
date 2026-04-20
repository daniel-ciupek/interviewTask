'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Messages', [
      { message: 'Pierwsza przykładowa wiadomość', createdAt: new Date(), updatedAt: new Date() },
      { message: 'Druga przykładowa wiadomość', createdAt: new Date(), updatedAt: new Date() },
      { message: 'Trzecia przykładowa wiadomość', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Messages', null, {});
  }
};
