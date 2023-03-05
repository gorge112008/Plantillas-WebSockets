const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

   addProduct(product) {
    try {
      const arrayProducts =  this.getProducts();
      const DuplicatedProduct = arrayProducts.find(
        (item) => item.code == product.code
      );
      if (DuplicatedProduct) {
        console.error(
          "\n" +
            `--> Unable to add ${product.title}. The following code has already been registered: ${product.code}`
        );
        return "duplicate";
      } else if (arrayProducts.length !== 0){
        
         fs.writeFileSync(
          this.path,
          JSON.stringify(
            [
              ...arrayProducts,
              {
                ...product,
                id: arrayProducts[arrayProducts.length - 1].id + 1,
              },
            ],
            null,
            2
          ),
          "utf-8"
        );
        return "added";
      }else {
         fs.writeFileSync(
          this.path,
          JSON.stringify([{ ...product, id: 1 }]),
          "utf-8"
        );
        return "added";
      }
    } catch (error) {
      console.log(error);
    }
  }

  getProducts() {
    try {
      const content = fs.readFileSync(this.path, "utf-8");
      const parseContent = JSON.parse(content);
      return parseContent;
    } catch (error) {
      console.log("Error: Not products found.");
      return [];
    }
  }

  getProductById(id) {
    try {
      const arrayProducts = this.getProducts();
      const searchID = arrayProducts.find((item) => item.id == id);
      if (!searchID) {
        console.log(`Not products found with id ${id}`);
      } else {
        console.log(
          `Here's your product: ${JSON.stringify(searchID.description)}`
        );
        return searchID;
      }
      return [];
    } catch (error) {
      console.error(`Not products found with id ${id}`);
      return [];
    }
  }

  updateProduct(id, product) {
    try {
      const arrayProducts = this.getProducts();
      const targetProduct = arrayProducts.map((productoT) =>
        productoT.id === +id ? { ...productoT, ...product } : productoT
      );
      if (isNaN(+id)) {
        console.log(`The value ${id} not is a ID`);
        return (`The value ${id} not is a ID`);
      }else if (!arrayProducts.find((product) => product.id === +id)){
        console.log(`Not products found with id ${id}`);
        return(`Not products found with id ${id}`);
      }else
        console.log(`Product ${id} updated`);
        fs.writeFileSync(
          this.path,
          JSON.stringify(targetProduct, null, 4)
        );
        return(`Product ${id} updated Succesfully`);
      
    } catch (error) {
      console.log(`Could not update product with id ${id}.`);
    }
  }
  deleteProduct(id) {
    try {
      const arrayProducts = this.getProducts();
      const targetProduct = arrayProducts.filter(
        (productoT) => productoT.id !== +id
      );
      if (isNaN(+id)) {
        console.log(`The value ${id} not is a ID`);
      }else if (!arrayProducts.find((product) => product.id === +id)){
        console.log(`Not products found with id ${id}`);
      }else
        console.log(`Product ${id} deleted`);
         fs.writeFileSync(
          this.path,
          JSON.stringify(targetProduct, null, 4)
        );
    } catch (error) {
      console.log(`Could not delete product with id ${id}.`);
    }
  }
}

const productList = new ProductManager("./data/products.json");

module.exports = {
  productManager: productList,
};
