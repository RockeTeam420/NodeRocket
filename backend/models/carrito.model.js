// backend/models/productos.models.js
const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: [true, 'El ID es obligatorio']
    }
});

[
    {
        "referencia": "2873bcb2-b224-473b-b313-66e4f37193cf",
        "nombre": "Camiseta Xl",
        "precio": 62000,
        "imagen": "https://picsum.photos/300/300?random=1",
        "cantidad": 1
    },
    {
        "referencia": "a52a673c-4437-4740-a907-7177387108d7",
        "nombre": "Pantalon2",
        "precio": 50000,
        "imagen": "https://picsum.photos/300/300?random=3",
        "cantidad": 1
    }
]


const carritoModel = mongoose.model('Carrito', carritoSchema);

module.exports = carritoModel;

