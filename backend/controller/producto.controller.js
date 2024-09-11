const productoModel = require('../models/productos.models')

exports.verProducto  = async (req, res) => {
    try {
        const productos = await productoModel.find({});
        return productos
    } catch (error) {
        res.status(500).json({ message: 'Producto no encontrado'});
    }
};
