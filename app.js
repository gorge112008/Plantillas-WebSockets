const express = require("express");
const handlebars = require("express-handlebars");
const { routerProducts } = require("./products");
const { productManager } = require("./ProductManager.js");
const { routerCarts } = require("./carts");
const { Server } = require("socket.io");

const app = express();

const port = 8080;
const httpServer = app.listen(port, () => {
  console.log("Server up in port", port);
});

const socketServer = new Server(httpServer);

function obtenerproductos() {
  let productos = [];
  let response = productManager.getProducts();
  response.forEach((lista) => {
    productos.push(lista);
  });
  return productos;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routerCarts, routerProducts);

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get("/home", (req, res) => {
  let response = productManager.getProducts();
  res.render("home", { response });
});

app.get("/realtimeproducts", (req, res) => {
  let response = obtenerproductos();
  res.render("realTimeProducts", { response });
});

socketServer.on("connection", (socket) => {

  console.log("New client connected");

  socket.emit("products", obtenerproductos());

  socket.on("addproduct", (product) => {
    productManager.addProduct(product);
    socket.broadcast.emit("f5NewProduct", product);
  });

  socket.on("ProductDeleted", (IDproduct, deletedproduct) => {
    productManager.deleteProduct(IDproduct);
    socket.broadcast.emit("f5deleteProduct", deletedproduct);
  });
});

//socket.broadcast.emit('broadcast','GOLA');
/*
  socket.broadcast.emit('broadcast','Saluda al nuevo cliente');
  socketServer.emit('multicast','Saludar Todos');*/

/*app.get ('/realtimeproducts/:pro', (req, res)=>{
    let user=req.params.pro;
    let response = productManager.getProducts();
    productManager.updateProduct(2, {description: user});
    console.log(response);
    res.rend'er('realTimeProducts', {response});
  })*/
