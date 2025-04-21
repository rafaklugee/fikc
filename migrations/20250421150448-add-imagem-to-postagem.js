'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('postagens', 'imagem', {
      type: Sequelize.STRING
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('postagens', 'imagem');
  }
};
