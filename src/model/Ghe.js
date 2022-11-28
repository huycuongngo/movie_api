const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Ghe.init(sequelize, DataTypes);
}

class Ghe extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    ma_ve: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'DatVe',
        key: 'ma_ve'
      }
    },
    ma_rap: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'RapPhim',
        key: 'ma_rap'
      }
    },
    ma_ghe: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ten_ghe: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    loai_ghe: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Ghe',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ma_ghe" },
        ]
      },
      {
        name: "ma_ve",
        using: "BTREE",
        fields: [
          { name: "ma_ve" },
        ]
      },
      {
        name: "ma_rap",
        using: "BTREE",
        fields: [
          { name: "ma_rap" },
        ]
      },
    ]
  });
  }
}
