const { DataTypes } = require('sequelize');
const db = require('./db');

const User = db.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

const Book = db.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING },
  note: { type: DataTypes.TEXT },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE }
});

User.hasMany(Book, { foreignKey: 'userId' });
Book.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Book };
