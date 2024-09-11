const conexion = require('../config/connection');

// Define el esquema del pedido
const pedidoSchema = new conexion.Schema({
    cliente: {
        type: String,
        required: [true, 'El cliente es obligatorio']
    },
    carrito: {
        producto: {
            type: String,
            required: [true, 'El producto es obligatorio']
        },
        cantidad: {
            type: Number,
            required: [true, 'La cantidad es obligatoria']
        }
    },
    subtotal: {
        type: Number,
        required: [true, 'El subtotal es obligatorio']
    },
    impuesto: {
        type: Number,
        required: [true, 'El impuesto es obligatorio']
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatorio']
    },
    estado: {
        type: String,
        enum: ['creado', 'pagado', 'enviado', 'recibido', 'cancelado', 'finalizado'],
        default: 'creado'
    },
    fechaPedido: {
        type: Date,
        default: Date.now
    }
});

// Usa `mongoose.models` para evitar sobrescribir el modelo
const pedidoModel = conexion.models.pedidos || conexion.model('pedidos', pedidoSchema);

module.exports = pedidoModel;
