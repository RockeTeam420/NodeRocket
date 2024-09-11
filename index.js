const express = require('express');
const modeloUsuario = require('./backend/models/user.models');
const clienteModel = require('./backend/models/cliente.models');
const productoModel = require('./backend/models/productos.models');
const pedidoModel = require('./backend/models/pedidos.models');
const mongoose = require('mongoose');
const logger = require('morgan');
require('dotenv').config();
const router = require('./backend/router/router');

const app = express();
app.use('/v1', router);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger('dev'));
app.use('/api', router);
app.use('/productos', router);

const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/frontend/views'));

app.get('/mostrar', async (req, res) => {
    const consulta = await modeloUsuario.find({});
    res.render('pages/index', { usuarios: consulta });
});

app.get('/carrito', async (req, res) => {
    const consulta = await modeloUsuario.find({});
    res.render('pages/carrito', { usuarios: consulta });
});

app.get("/usuarios", async (req, res) => { // es una promesa que cuando queramos hacer una funcion el await dice que hay que esperar que este caido o no entonces es una promesa
    const consulta = await modeloUsuario.find({});
    if (consulta) {
        res.status(200).json(consulta);
    }
    else {
        res.status(404).json("No hay usuarios");
    }
});

app.get("/usuarios/:correo", async (req, res) => {
    const busqueda = await modeloUsuario.findOne({ correo: req.params.correo });
    if (busqueda) {
        res.status(200).json(busqueda);
    }
    else {
        res.status(404).json("No hay usuarios");
    }
});

app.post("/usuarios", async (req, res) => {
    console.log(req.body)
    const nuevo = {
        correo: req.body.correo,
        pass: req.body.pass,
        rol: req.body.rol,
        habilitado: true,
    };
    let consulta = await modeloUsuario.create(nuevo);
    if (consulta) {
        res.status(200).json("Usuario creado");
    }
    else {
        res.status(404).json("No se pudo crear el usuario");
    }
});


app.put("/usuarios/:correo", async (req, res) => {
    const nombreUser = req.body.nombreuser;
    const usuarioEditado = {
        nombre: nombreUser,
        correo: req.body.correouser,
        pasword: req.body.passworduser,
        rol: req.body.roluser,
        habilitado: true,
    };
    let actualizado = await modeloUsuario.findOneAndUpdate({ nombre: nombreUser }, usuarioEditado);
    if (actualizado) {
        res.json(actualizado);
    } else {
        res.status(404).json({ message: "Usuario no encontrado" });
    }
});


app.delete("/usuarios/:correo", async (req, res) => {
    console.log(req.body.correo, req.body.correouser)
    let eliminacion = await modeloUsuario.findOneAndDelete({ correo: req.body.correo });
    if (eliminacion) {
        res.json(eliminacion);
    } else {
        res.status(404).json({ message: "Usuario no encontrado" });
    }
});

// Rutas para el modelo cliente
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await clienteModel.find({});
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/clientes/:correo', async (req, res) => {
    try {
        const cliente = await clienteModel.findOne({ correo: req.params.correo });
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/clientes', async (req, res) => {
    try {
        const nuevoCliente = new clienteModel(req.body);
        const cliente = await nuevoCliente.save();
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/clientes/:correo', async (req, res) => {
    try {
        const cliente = await clienteModel.findOneAndUpdate(
            { correo: req.params.correo },
            req.body,
            { new: true }  // Devuelve el documento modificado en lugar del original
        );
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/clientes/:correo', async (req, res) => {
    try {
        const cliente = await clienteModel.findOneAndDelete({ correo: req.params.correo });
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Rutas para el modelo producto
app.get('/productos', async (req, res) => {
    try {
        const productos = await productoModel.find({});
        res.render('pages/listarProductos', { productos: productos });
    } catch (error) {
        res.status(500).json({ message: 'Producto no encontrado' });
    }
});

app.get('/productos/:id', async (req, res) => {
    try {
        const producto = await productoModel.findById(req.params.id);
        if (producto) {
            res.status(200).json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/productos', async (req, res) => {
    try {
        const nuevoProducto = new productoModel(req.body);
        const producto = await nuevoProducto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ message: 'No se pudo registrar el producto: ' + error.message });
    }
});

app.put('/productos/:id', async (req, res) => {
    try {
        const producto = await productoModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (producto) {
            res.status(200).json({ message: 'Producto actualizado correctamente', producto });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.delete('/productos/:id', async (req, res) => {
    try {
        const producto = await productoModel.findByIdAndDelete(req.params.id);

        if (producto) {
            res.status(200).json({ message: 'Producto eliminado correctamente', producto });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

function deleteOne(id) {
    fetch(`/deleteProductos/${id}`, {
        method: 'DELETE',
    })
        .then(
            alert('Eliminado correctamente'),
            console.log('has')
        )
    location.href = '/v1/index'
}

// Rutas para el modelo pedido
app.get('/pedidos', async (req, res) => {
    try {
        const pedidos = await pedidoModel.find({}).populate('cliente').populate('carrito.producto');
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/pedidos/:cliente', async (req, res) => {
    try {
        // Busca el pedido por el nombre del cliente
        const pedidos = await pedidoModel.find({ cliente: req.params.cliente });

        // Verifica si se encontraron pedidos
        if (pedidos.length > 0) {
            res.status(200).json(pedidos);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado para el cliente especificado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/pedidos', async (req, res) => {
    try {
        const nuevoPedido = new pedidoModel(req.body);
        const pedido = await nuevoPedido.save();
        res.status(201).json({
            message: 'Pedido creado exitosamente', pedido
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.put('/pedidos/:cliente', async (req, res) => {
    try {
        const pedido = await pedidoModel.findOneAndUpdate(
            { cliente: req.params.cliente }, req.body,
            { new: true }
        );

        if (pedido) {
            res.status(200).json({ message: 'Pedido actualizado correctamente', pedido });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



app.delete('/pedidos/:cliente', async (req, res) => {
    try {
        const pedido = await pedidoModel.findOneAndDelete({ cliente: req.params.cliente });

        if (pedido) {
            res.status(200).json({ message: 'Pedido eliminado correctamente', pedido });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado para el cliente especificado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const emailService = require('./backend/utils/email.service');
const userModel = require("./backend/models/user.models");
app.get('/enviarcorreo', async (req, res) => {
    await emailService.sendEmail(
        "juanpabloarango.iearm@gmail.com",
        "Confirmación de Registro",
        "Bienvenido a la tienda en línea más top de todo el mundo",
    );
})

app.get('/registrocompleto', async (req, res) => {
    const nuevo = {
        correo: "juanpabloarango.iearm@gmail.com",
        pass: "12345",
        rol: "cliente",
        habilitado: true
    }
    let usuarioTemporal = await modeloUsuario(nuevo).save();
    console.log(usuarioTemporal)
    const cliente = {
        nombre: "Juan",
        telefono: "123456789",
        direccion: "Calle 123",
        habilitado: true,
        usuario: usuarioTemporal._id
    }
    await modeloCliente(cliente).save();
})


app.get('/productos', async (req, res) => {
    let listadoProductos = await modeloProducto.find();
    if (listadoProductos)
        res.render('paginas/listarProductos', { listadoProductos })
    else;
    //renderizar error
})


// Añadir al carrito
app.post('/productos', async (req, res) => {
    try {
        const nuevoProducto = new productoModel(req.body);
        const producto = await nuevoProducto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ message: 'No se pudo registrar el producto: ' + error.message });
    }
});

app.post('/carrito', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ error: 'Product ID and quantity are required' });
        }

        // Buscar el producto por ID
        const producto = await Producto.findById(productId);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Aquí iría la lógica para agregar el producto al carrito del usuario
        // Por ejemplo, actualizar la cantidad en el carrito del usuario, etc.

        // Simulación de éxito
        res.status(200).json({ success: true, message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});
app.listen(process.env.PORT)

