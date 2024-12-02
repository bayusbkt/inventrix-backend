"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Units",
      [
        {
          id: uuidv4(),
          item_id: uuidv4(),
          user_id: uuidv4(),
          status: "Tersedia",
          description: "Masih bagus",
          outTime: new Date(),
          inTime: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", { role: "Admin" }, {});
  },
};
