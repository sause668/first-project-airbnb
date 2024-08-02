'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'cascade'
      },
      // address: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   validate: {
      //     len: [5, 100]
      //   }
      // },
      // city: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   validate: {
      //     len: [2, 50]
      //   }
      // },
      // state: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   validate: {
      //     len: [2, 50]
      //   }
      // },
      // country: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   validate: {
      //     len: [2, 50]
      //   }
      // },
      // lat: {
      //   type: {
      //     type: Sequelize.DECIMAL,
      //     validate: {
      //       min: -90,
      //       max: 90
      //     }
      //   }
      // },
      // lng: {
      //   type: {
      //     type: Sequelize.DECIMAL,
      //     validate: {
      //       min: -180,
      //       max: 180
      //     }
      //   }
      // },
      // name: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   validate: {
      //     len: [3, 50]
      //   }
      // },
      // description: {
      //   type: Sequelize.TEXT,
      //   allowNull: false
      // },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Spots');
  }
};