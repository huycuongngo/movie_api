const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Phim.init(sequelize, DataTypes);
}

class Phim extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    ma_phim: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ten_phim: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    trailer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hinh_anh: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mo_ta: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ngay_khoi_chieu: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    danh_gia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hot: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    dang_chieu: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    sap_chieu: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Phim',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ma_phim" },
        ]
      },
    ]
  });
  }
}
