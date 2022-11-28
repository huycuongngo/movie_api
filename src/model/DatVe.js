const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return DatVe.init(sequelize, DataTypes);
}

class DatVe extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    tai_khoan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'NguoiDung',
        key: 'tai_khoan'
      }
    },
    ma_lich_chieu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'LichChieu',
        key: 'ma_lich_chieu'
      }
    },
    ma_ve: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'DatVe',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ma_ve" },
        ]
      },
      {
        name: "tai_khoan",
        using: "BTREE",
        fields: [
          { name: "tai_khoan" },
        ]
      },
      {
        name: "ma_lich_chieu",
        using: "BTREE",
        fields: [
          { name: "ma_lich_chieu" },
        ]
      },
    ]
  });
  }
}
