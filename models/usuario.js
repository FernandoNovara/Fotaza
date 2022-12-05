'use strict'

const { Model } = require('sequelize')
  
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    
    static associate(models) {
        Usuario.hasMany(models.Imagen ,{as: "Imagenes", foreignKey: "usuario_id"})
        Usuario.hasMany(models.Comentario ,{as: "Comentarios", foreignKey: "usuario_id"})
        Usuario.hasOne(models.Valoracion, {as:"valoraciones",foreignKey: "usuario_id"})
        Usuario.hasMany(models.Publicacion, {as: "Publicaciones",foreignKey: "usuario_id"})
    }
  }
  Usuario.init({
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    Clave: {
      type: DataTypes.STRING(100),
      allowNull: false
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
      allowNull: true
    },
    Ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Avatar: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Usuario',
  })
  return Usuario
}