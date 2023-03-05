const express = require("express");
const routerProducts = express.Router();
const { productManager } = require("./ProductManager.js");
routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }));

//endpoint
routerProducts.get("/products", function (req, res) {
  try {
    let response = productManager.getProducts();
    const limit = req.query.limit;
    if (limit && !isNaN(Number(limit))) {
      response = response.slice(0, limit);
    }
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});

routerProducts.get("/products/:pid", function (req, res) {
  try {
    const pid = req.params.pid;
    const response = productManager.getProductById(pid);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});

routerProducts.post("/products", function (req, res) {
  try {
    const newp = req.body;
    let response = productManager.addProduct(newp);
      if (response == "duplicate") {
        res.status(400).send(newp);
      } else if (response == "added") {
        res.status(200).send(newp);
      }
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});

routerProducts.put("/products/:pid", function (req, res) {
  try {
    const pid = req.params.pid;
    const body = req.body;
    if (body.id){
      res.status(400).send("Bad Request--> The ID cannot be updated or deleted");
    }else{
    let response = productManager.updateProduct(pid, body);
    res.status(200).send(response);
    }
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});

routerProducts.delete("/products/:pid", function (req, res) {
  try {
    const pid = req.params.pid;
    productManager.deleteProduct(pid);
    res.status(200).send(pid);
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});

routerProducts.get("*", function (req, res) {
  res.status(404).send("The route is incorrect");
});

module.exports = {
  routerProducts,
};
