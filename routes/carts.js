const fs = require("fs");
const express = require("express");
const routerCarts = express.Router();
const { CartsManager } = require("./CartsManager.js");
const { productManager } = require("./ProductManager.js");
routerCarts.use(express.json());
routerCarts.use(express.urlencoded({ extended: true }));

//endpoint
routerCarts.get("/carts", function (req, res) {
  try {
    let response = CartsManager.getProducts();
    const limit = req.query.limit;
    if (limit && !isNaN(Number(limit))) {
      response = response.slice(0, limit);
    }
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});

routerCarts.post("/carts", function (req, res) {
  try {
    const newp = req.body;
    let productnew = [];
    if (newp.products) {
      newp.products.forEach((item) => {
        if (item.id) {
          let find = 0;
          productnew.forEach((it) => {
            if (item.id == it.product) {
              it.quantity++;
              find = 1;
            }
          });
          if (find == 0) {
            productnew.push({ product: item.id, quantity: 1 });
          }
        }
      });
      newp.products = productnew;
      CartsManager.addProduct(newp);
      res.status(200).send("New Cart Added Succesfully");
    } else {
      res.status(400).send("Bad Request--> The products are not valids");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

routerCarts.get("/carts/:cid", function (req, res) {
  try {
    const cid = req.params.cid;
    const response = CartsManager.getProductById(cid);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});

routerCarts.post("/carts/:cid/products/:pid", function (req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const arrayProducts = CartsManager.getProducts();
    const responsecid = CartsManager.getProductById(cid);
    const responsepid = productManager.getProductById(pid);
    if (!isNaN(responsepid) || !isNaN(responsecid)) {
      res.status(400).send(`Error --> The route is not valid`);
    } else {
      arrayProducts.forEach((item) => {
        if (item.id == +cid) {
          //SI EL ARREGLO TIENE LA ID DEL CARRITO SE ENTRA
          let find = 0;
          item.products.forEach((producto) => {
            if (producto.product == +pid) {
              //SI EL PRODUCTO TIENE LA ID REPETIDA SE SUMA
              producto.quantity++;
              find = 1;
              res.status(200).send("ADDED PRODUCT");
            }
          });
          if (find == 0) {
            item.products.push({ product: responsepid.id, quantity: 1 });
            res.status(200).send("NEW PRODUCT");
          }
        }
      });
      fs.writeFileSync(
        "./carrito.json",
        JSON.stringify(arrayProducts, null, 4)
      );
    }
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});

module.exports = {
  routerCarts,
};
