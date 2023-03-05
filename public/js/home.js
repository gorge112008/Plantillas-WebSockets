const socket = io();
const storeProducts = [];
let URLdomain = window.location.host;
let protocol = window.location.protocol;

socket.on("products", (getProducts) => {
  Object.assign(storeProducts, getProducts);
  crearHtml();
  let btnsDelete = document.querySelectorAll(".btn");
  btnsDelete.forEach((selectBtn) => {
    selectBtn.addEventListener("click", () => {
      storeProducts.forEach((searchID) => {
        if (searchID.id == selectBtn.id) {
          Swal.fire({
            title:
              "YOU WANT TO DELETE THE PRODUCT " +
              searchID.tittle.toUpperCase() +
              " ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "YES",
            denyButtonText: "NOT",
          }).then((result) => {
            if (result.isConfirmed) {
              let url = protocol+"//"+URLdomain+"/api/products/";
              deleteData(url, searchID.id)
                .then((data) => {
                  storeProducts.splice(storeProducts.indexOf(searchID), 1); 
                  crearHtml();
                  Swal.fire({
                    title: "Product Removed Successfully!!!",
                    text:
                      "Product Removed: " +
                      "ID: " +
                      data +
                      " --> " +
                      searchID.tittle,
                    icon: "success",
                    confirmButtonText: "Accept",
                  });
                  socket.emit("deleteproduct", storeProducts.indexOf(searchID)); 
                })
                .catch((error) => console.log("Error:" + error));
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        }
      });
    });
  });
});

const form = document.querySelector("form");

const inputTittle = document.querySelector("#tittle"),
  inputDescription = document.querySelector("#description"),
  inputCode = document.querySelector("#code"),
  inputPrice = document.querySelector("#price"),
  inputStock = document.querySelector("#stock"),
  inputThumbnail = document.querySelector("#thumbnail"),
  contain = document.querySelector("#contain");

class NewProduct {
  constructor() {
    this.tittle = inputTittle.value;
    this.description = inputDescription.value;
    this.code = +inputCode.value;
    this.status = true;
    this.stock = +inputStock.value;
    this.category = "Food";
    this.price = +inputPrice.value;
    this.thumbnail = this.thumbnail? inputThumbnail.value : "https://finvero.com/assets/img/shoppers/products/Not_found.png";
  }
}

//funciones
function crearHtml() {
  contain.innerHTML = "";
  let html;
  for (const product of storeProducts) {
    html = `<div class="col s4 m3">
 <div class="card">
<div class="card-image">
 <img class="responsive-img" src=${product.thumbnail} />
 <span class="card-title">${product.tittle}</span>
</div>
<div class="card-content">
 <b>
   ${product.description}
 </b>
 <p>$${product.price}</p>
 <b>Code: <b class="code">${product.code}</b></b>
</div>
<div class="card-action">
 <input type= "button" id=${product.id} class="btn" value="Delete" >
</div>
</div>
</div>`;
    contain.innerHTML += html;
  }
}

async function deleteData(url, id) {
  try {
    let key = url + id;
    let response = await fetch(key, {
      method: "DELETE",
      "Access-Control-Allow-Origin" : "*", 
      "Access-Control-Allow-Credentials" : true ,
      mode: 'cors',
    });
    return response.json();
  } catch {
    console.log(Error);
  }
}

async function postData(url, data) {
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin" : "*", 
      "Access-Control-Allow-Credentials" : true ,
      mode: 'cors',
      body: JSON.stringify(data),
    });
    if (response.status == 400) {
      return;
    } else if (response.status == 200) {
      return response.json();
    }
  } catch {
    console.log(Error);
  }
}

socket.on("f5NewProduct", (newProduct) => {
  storeProducts.push(newProduct);
  crearHtml();
  socket.emit("inicializar","Inicio");
});

socket.on("f5deleteProduct", (deleteProduct) => {
  storeProducts.splice(deleteProduct, 1);
  crearHtml();
  socket.emit("inicializar","Inicio");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const product = new NewProduct();
  let url = protocol+"//"+URLdomain+"/api/products";
  postData(url, product)
    .then((data) => {
      if (data == null) {
        Swal.fire({
          title: "Error>> Repeated Code f",
          text: "Please enter a new code",
          icon: "error",
          confirmButtonText: "Accept",
        });
        inputCode.value = "";
        inputCode.focus();
      } else {
        storeProducts.push(data);
        crearHtml();
        Swal.fire({
          title: "Product Added Successfully!",
          text: "Registered Product: " + data.tittle,
          icon: "success",
          confirmButtonText: "Accept",
        });
        form.reset();
        socket.emit("addproduct", data);
      }
    })
    .catch((error) => console.log("Error:" + error));
});
