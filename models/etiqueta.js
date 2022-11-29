'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Etiqueta extends Model {

    static associate(models) {
      Etiqueta.belongsTo(models.Publicacion)
    }
  }
  Etiqueta.init({ 
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  }, 
  {
    sequelize,
    modelName: 'Etiqueta',
  })
  return Etiqueta
}