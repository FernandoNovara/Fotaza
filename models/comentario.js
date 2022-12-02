'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comentario extends Model {

    static associate(models) {
      Comentario.belongsTo(models.Usuario)
      Comentario.belongsTo(models.Publicacion, {foreignKey: "publicacion_id"})
    }
  }
  Comentario.init({
    Fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Descripcion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Comentario',
  })
  return Comentario;
}