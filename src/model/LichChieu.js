const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return LichChieu.init(sequelize, DataTypes);
}

class LichChieu extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    ma_rap: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'RapPhim',
        key: 'ma_rap'
      }
    },
    ma_phim: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Phim',
        key: 'ma_phim'
      }
    },
    ma_lich_chieu: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ngay_gio_chieu: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gia_ve: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'LichChieu',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ma_lich_chieu" },
        ]
      },
      {
        name: "ma_rap",
        using: "BTREE",
        fields: [
          { name: "ma_rap" },
        ]
      },
      {
        name: "ma_phim",
        using: "BTREE",
        fields: [
          { name: "ma_phim" },
        ]
      },
    ]
  });
  }
}
