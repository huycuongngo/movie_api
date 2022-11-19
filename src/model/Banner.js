const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Banner.init(sequelize, DataTypes);
}

class Banner extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    ma_phim: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Phim',
        key: 'ma_phim'
      }
    },
    ma_banner: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hinh_anh: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Banner',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ma_banner" },
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
