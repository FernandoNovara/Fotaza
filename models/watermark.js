'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class WaterMark extends Model {

    static associate(models) {
      WaterMark.belongsTo(models.Usuario)
    }
  }
  WaterMark.init({
    Tipo: {
      type: DataTypes.ENUM("Imagen","Texto"),
      defaultValue: "Texto"
    },
    Marca: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'WaterMark',
  })
  return WaterMark;
}