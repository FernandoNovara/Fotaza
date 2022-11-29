'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Valoracion extends Model {

    static associate(models) {
      Valoracion.belongsTo(models.Usuario)
      Valoracion.belongsTo(models.Publicacion)
    }
  }
  Valoracion.init({
    Estrellas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Valoracion',
  })
  return Valoracion
}