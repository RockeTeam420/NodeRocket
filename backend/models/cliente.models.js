// backend/models/cliente.models.js
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        unique: [true, 'El email ya existe'],
        required: [true, 'El email es obligatorio']
    },
    usuario: {
        type: String,
        required: [true, 'El usuario es obligatorio']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria']
    },
    saldo: {
        type: Number,
        default: 0,
        required: [true, 'El saldo es obligatorio']
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { versionKey: false });

const clienteModel = mongoose.model('Cliente', clienteSchema);

module.exports = clienteModel;
