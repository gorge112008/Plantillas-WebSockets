var trees = ['cedar', 'oak', 'maple'];
//console.log(...trees);
//console.log(trees);
var mycar =[ { make: 'Honda', model: 'Accord', year: 1998 },{ make: 'Toyota', model: 'Accord', year: 1998 }];
//console.log(( 0 in mycar?{ ...mycar}:"nel"));
var nuevo=[];
//console.log({ ...mycar});
//console.log();
Object.assign(nuevo, { ...mycar});
//console.log(nuevo);
//const targetProduct = mycar.map((productoT) =>
//        productoT.make === 'Honda' ? { ...productoT, nuevo:'Ola' } : productoT
 //     );
    
//console.log(targetProduct);
class Producto {
    constructor() {
        this.tittle = "lok";
        this.description = "lol";
        this.code = 3;
        this.status = true;
        this.stock = 12;
        this.category = "Food";
        this.price = 12;
        this.thumbnail = "";
    }
  }

  const producto =  new Producto();

  console.log(producto);