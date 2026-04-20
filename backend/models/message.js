import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const Message = sequelize.define('Message', {
  message: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: { notEmpty: true }
  }
});

export default Message;
