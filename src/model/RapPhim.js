const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return RapPhim.init(sequelize, DataTypes);
}

class RapPhim extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    ma_cum_rap: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CumRap',
        key: 'ma_cum_rap'
      }
    },
    ma_rap: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ten_rap: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'RapPhim',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ma_rap" },
        ]
      },
      {
        name: "ma_cum_rap",
        using: "BTREE",
        fields: [
          { name: "ma_cum_rap" },
        ]
      },
    ]
  });
  }
}
