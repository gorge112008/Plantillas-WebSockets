const express = require("express");
const handlebars = require("express-handlebars");
const { routerProducts } = require("./routes/products");
const { productManager } = require("./routes/ProductManager.js");
const { routerCarts } = require("./routes/carts");
const { Server } = require("socket.io");

const app = express();

const port = 8080;
const httpServer = app.listen(port, () => {
  console.log("Server up in port", port);
});

const socketServer = new Server(httpServer);

function initProducts() {
  let products = [];
  let response = productManager.getProducts();
  response.forEach((listProducts) => {
    products.push(listProducts);
  });
  return products;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routerCarts, routerProducts);

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", {});
});

app.get("/home", (req, res) => {
  let response =  initProducts();
  console.log(response);
  res.render("home", { response });
});

app.get("/realtimeproducts", (req, res) => {
  let response = initProducts();
  res.render("realTimeProducts", { response });
});

socketServer.on("connection", (socket) => {

  console.log("New client connected");

  socket.emit("products", initProducts());

  socket.on("addproduct", (newProduct) => {
    socket.broadcast.emit("f5NewProduct", newProduct);
    socket.emit("products", initProducts());
  });

  socket.on("deleteproduct", (idproduct) => {
    socket.broadcast.emit("f5deleteProduct", idproduct);
    socket.emit("products", initProducts());
  });
});
