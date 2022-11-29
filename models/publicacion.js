'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Publicacion extends Model {

    static associate(models) {
      Publicacion.belongsTo(models.Imagen)
      Publicacion.belongsTo(models.Usuario)
      Publicacion.hasOne(models.Valoracion, {as: "Valoraciones_publicacion", foreignKey: "publicacion_id"})
      Publicacion.hasMany(models.Comentario, {as: "Comentario_publicacion", foreignKey: "publicacion_id"})
      Publicacion.hasMany(models.Etiqueta, {as: "Etiqueta_publicacion", foreignKey: "publicacion_id"})

    }
  }
  Publicacion.init({
    Titulo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Categoria: {
      type: DataTypes.ENUM("Ninguno","Colegio","Juguetes","Animales","Alimentos","Ropa","Transporte","oficios","Partes del Cuerpo","Muebles","Instrumentos Musicales","Flores"), 
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