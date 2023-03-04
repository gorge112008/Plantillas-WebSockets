if (window.location.pathname=="/") {
    const Static = document.querySelector("#Static");
    const Dinamic = document.querySelector("#Dinamic");
    Static.addEventListener('click', (e)=>{
        e.preventDefault;
        window.location.href = "/home"; 
    })
    Dinamic.addEventListener('click', (e)=>{
        e.preventDefault;
        window.location.href = "/realtimeproducts"; 
    })
}else{
    const index = document.querySelector("#return");
    index.addEventListener('click', (e)=>{
        e.preventDefault;
        window.location.href = "../"; 
    })
    
}

