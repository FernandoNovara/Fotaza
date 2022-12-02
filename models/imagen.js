'use strict'

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Imagen extends Model {
    static associate(models) {
      Imagen.belongsTo(models.Usuario)
      Imagen.hasOne(models.Publicacion ,{as: "Post",foreignKey: "imagen_id" , onDelete: "CASCADE"})
    }
  }
  Imagen.init({
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Estado: {
      type: DataTypes.ENUM("Publico","Protegido"),
      defaultValue: "Protegido"
    },
    Tamaño: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Formato: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Resolucion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Derecho_Uso: {
      type: DataTypes.ENUM("Copyright","Copyleft"),
      defaultValue: "Copyright"
    },
  }, {
    sequelize,
    modelName: 'Imagen',
  })
  return Imagen;
}