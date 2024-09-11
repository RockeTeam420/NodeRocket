// backend/models/productos.models.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio']
    },
    imagen: [
        {
            type: String,
            required: [true, 'Las imágenes son obligatorias']
        }
    ],
    habilitado: {
        type: Boolean,
        required: [true, 'El estado de habilitación es obligatorio']
    },
});

const productoModel = mongoose.model('Producto', productoSchema);

module.exports = productoModel;
