// Catálogo de gorras NBA (abbr = monograma; bg/accent = colores del equipo)
const productos = [
  { id:1, team:"Los Angeles Lakers", conf:"Oeste", price:89900, abbr:"LAL", bg:"#552583", accent:"#fdb927" },
  { id:2, team:"Boston Celtics", conf:"Este", price:89900, abbr:"BOS", bg:"#007a33", accent:"#ffffff" },
  { id:3, team:"Golden State Warriors", conf:"Oeste", price:94900, abbr:"GSW", bg:"#1d428a", accent:"#ffc72c" },
  { id:4, team:"Chicago Bulls", conf:"Este", price:84900, abbr:"CHI", bg:"#ce1141", accent:"#ffffff" },
  { id:5, team:"Miami Heat", conf:"Este", price:84900, abbr:"MIA", bg:"#98002e", accent:"#f9a01b" },
  { id:6, team:"Milwaukee Bucks", conf:"Este", price:89900, abbr:"MIL", bg:"#00471b", accent:"#eee1c6" },
  { id:7, team:"Denver Nuggets", conf:"Oeste", price:89900, abbr:"DEN", bg:"#0e2240", accent:"#fec524" },
  { id:8, team:"Phoenix Suns", conf:"Oeste", price:84900, abbr:"PHX", bg:"#1d1160", accent:"#e56020" },
  { id:9, team:"Dallas Mavericks", conf:"Oeste", price:89900, abbr:"DAL", bg:"#00538c", accent:"#b8c4ca" },
  { id:10, team:"New York Knicks", conf:"Este", price:94900, abbr:"NYK", bg:"#006bb6", accent:"#f58426" },
  { id:11, team:"Philadelphia 76ers", conf:"Este", price:84900, abbr:"PHI", bg:"#006bb6", accent:"#ed174c" },
  { id:12, team:"Oklahoma City Thunder", conf:"Oeste", price:89900, abbr:"OKC", bg:"#007ac1", accent:"#ef3b24" },
];

const fmt = n => "$" + n.toLocaleString("es-CO");

let carrito = JSON.parse(localStorage.getItem("nbacart") || "[]");

// Render productos
const grid = document.getElementById("productGrid");
function renderProductos(filtro="todos"){
  grid.innerHTML = "";
  productos
    .filter(p => filtro==="todos" || p.conf===filtro)
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-img" style="background:${p.bg}">
          <div class="crest" style="border-color:${p.accent};color:${p.accent}">${p.abbr}</div>
        </div>
        <div class="card-body">
          <div class="card-team">${p.team}</div>
          <div class="card-conf">Conferencia ${p.conf}</div>
          <div class="card-price">${fmt(p.price)}</div>
          <button class="btn" data-add="${p.id}">Agregar</button>
        </div>`;
      grid.appendChild(card);
    });
}

// Filtros
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    renderProductos(btn.dataset.filter);
  });
});

// Agregar al carrito (delegación)
grid.addEventListener("click", e => {
  const id = e.target.dataset.add;
  if(!id) return;
  const prod = productos.find(p => p.id == id);
  const item = carrito.find(i => i.id == id);
  if(item) item.qty++;
  else carrito.push({ ...prod, qty:1 });
  guardar();
});

// Carrito UI
const cart = document.getElementById("cart");
const overlay = document.getElementById("cartOverlay");
const abrir = () => { cart.classList.add("open"); overlay.classList.add("open"); };
const cerrar = () => { cart.classList.remove("open"); overlay.classList.remove("open"); };
document.getElementById("cartBtn").addEventListener("click", abrir);
document.getElementById("closeCart").addEventListener("click", cerrar);
overlay.addEventListener("click", cerrar);

function renderCarrito(){
  const cont = document.getElementById("cartItems");
  const count = carrito.reduce((a,i)=>a+i.qty,0);
  document.getElementById("cartCount").textContent = count;
  const total = carrito.reduce((a,i)=>a+i.price*i.qty,0);
  document.getElementById("cartTotal").textContent = fmt(total);

  if(!carrito.length){
    cont.innerHTML = '<p class="cart-empty">Tu carrito está vacío 🛒</p>';
    return;
  }
  cont.innerHTML = "";
  carrito.forEach(i => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <span class="crest crest-sm" style="border-color:${i.accent};color:${i.accent};background:${i.bg}">${i.abbr}</span>
      <div class="cart-item-info">
        <strong>${i.team}</strong>
        <span>${fmt(i.price)}</span>
      </div>
      <div class="qty">
        <button data-dec="${i.id}">−</button>
        <span>${i.qty}</span>
        <button data-inc="${i.id}">+</button>
      </div>`;
    cont.appendChild(el);
  });
}

document.getElementById("cartItems").addEventListener("click", e => {
  const inc = e.target.dataset.inc, dec = e.target.dataset.dec;
  if(inc) carrito.find(i=>i.id==inc).qty++;
  if(dec){
    const it = carrito.find(i=>i.id==dec);
    it.qty--;
    if(it.qty<=0) carrito = carrito.filter(i=>i.id!=dec);
  }
  if(inc||dec) guardar();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if(!carrito.length){ alert("Tu carrito está vacío."); return; }
  const total = carrito.reduce((a,i)=>a+i.price*i.qty,0);
  alert("¡Gracias por tu compra! Total: " + fmt(total));
  carrito = [];
  guardar();
  cerrar();
});

function guardar(){
  localStorage.setItem("nbacart", JSON.stringify(carrito));
  renderCarrito();
}

// Menú móvil
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

// Init
renderProductos();
renderCarrito();
