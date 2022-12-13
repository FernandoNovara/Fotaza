'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Publicacion extends Model {

    static associate(models) {
      Publicacion.belongsTo(models.Imagen, {as:"Imagenes" , foreignKey: "imagen_id", onDelete: "CASCADE"})
      Publicacion.belongsTo(models.Usuario, {as:"Usuario", foreignKey: "usuario_id"})
      Publicacion.hasOne(models.Valoracion, {as: "Valoraciones", foreignKey: "publicacion_id" , onDelete: "CASCADE"})
      Publicacion.hasMany(models.Comentario, {as: "Comentario", foreignKey: "publicacion_id" , onDelete: "CASCADE"})
      Publicacion.hasMany(models.Etiqueta, {as: "Etiquetas", foreignKey: "publicacion_id" , onDelete: "CASCADE"})

    }
  }
  Publicacion.init({
    Titulo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Categoria: {
      type: DataTypes.ENUM("Ninguno","Colegio","Juguetes","Animales","Alimentos","Ropa","Transporte","Oficios","Partes del Cuerpo","Muebles","Instrumentos Musicales","Flores"), 
      defaultValue: "Ninguno"
    },
    Fecha_Creacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Publicacion',
  })
  return Publicacion;
}