require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPEKEY);

const productoController = require('../controller/producto.controller');
const express = require('express');
const router = express.Router();

// index
router.get('/index', async (req, res) => {
    const productos = await productoController.verProducto()
    res.render('pages/index', { productos });
});

// carrito
router.get('/carrito', async (req, res) => {
    const productos = await productoController.verProducto()
    res.render('pages/index', { productos });
});

// Añadir producto
router.post('/productos', async (req, res) => {
    try {
        const nuevoProducto = new productoModel(req.body);
        const producto = await nuevoProducto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ message: 'No se pudo registrar el producto: ' + error.message });
    }
});

//Controlador de Productos
router.get('/productosAdmin', async (req, res) => {
    const productos = await productoController.verProducto()
    res.render('pages/listarProductos', { productos });
});

//Eliminar producto
router.delete('/productos/:id', async (req, res) => {
    try {
        const productoId = req.params.id;
        const result = await productoModel.findByIdAndDelete(productoId);

        if (!result) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto: ' + error.message });
    }
});

// Actualizar producto
router.put('/productos/:id', async (req, res) => {
    try {
        const productoId = req.params.id;
        const updatedData = req.body;
        const producto = await productoModel.findByIdAndUpdate(productoId, updatedData, { new: true, runValidators: true });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        res.status(200).json(producto);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el producto: ' + error.message });
    }
});

const calculateOrderAmount = (items) => {
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    let total = 0;
    items.forEach((item) => {
        total += (item.precio * item.cantidad);
    });
    return total;
};

router.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
      // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
      dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
  });

router.get('/checkout', async (req, res) => {
    res.render('pages/checkout.ejs')
  });

module.exports = router;