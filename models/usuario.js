'use strict'

const { Model } = require('sequelize')
  
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    
    static associate(models) {
        Usuario.hasMany(models.Imagen ,{as: "Imagenes", foreignKey: "usuario_id"})
        Usuario.hasMany(models.Comentario ,{as: "Comentarios", foreignKey: "usuario_id"})
        Usuario.hasOne(models.Valoracion, {as:"valoraciones",foreignKey: "usuario_id"})
        Usuario.hasMany(models.Publicacion, {as: "Publicacion_Usuario",foreignKey: "usuario_id"})
    }
  }
  Usuario.init({
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Apellido: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    Clave: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Telefono: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Fecha_Nac: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Interes: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    Ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Avatar: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Usuario',
  })
  return Usuario
}