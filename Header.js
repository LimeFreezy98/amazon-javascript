
function getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      return []; // fallback if corrupted
    }
  }

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify)
}



function renderHeader() {
    const cart = getCart();
    const cartCount = cart.reduce((sum, item) => sum + item.quanity, 0);



    const headerHTML = `
    <header class="d-flex justify-content-between align-items-center px-3">
      <div class="d-flex align-items-center">
        <img src="image/AmazonLogo.png" alt="Amazon" class="logo me-3">
        <input type="text" class="form-control me-2" placeholder="Search">
        <button class="btn btn-warning">Search</button>
      </div>
      <div class="cart-icon">
        <img src="image/amazon_cart.png" alt="Cart" width="100">
        <span class="cart-count">${cartCount}</span>
      </div>
    </header>
  `;
  document.body.insertAdjacentHTML("afterbegin", headerHTML);
}


const products = [
    {id: 1, name: "Black and Gray Socks 6 pair", price: 10.90, image: "image/socks.png"},
    {id: 2, name: "Medium size Basketball", price: 20.95, image: "image/basketball.png"},
    {id: 3, name: "T-shirt", price: 7.99, image: "image/T_shirt.png"},
    {id: 4, name: "Toaster", price: 19.99, image: "image/toaster.png"}
]


function renderProducts() {
    const productList = document.getElementById("product-list");
    products.forEach(product => {
      const productCard = `
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">$${product.price.toFixed(2)}</p>
              <input type="number" min="1" value="1" class="form-control mb-2 quantity" data-id="${product.id}">
              <button class="btn btn-warning add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
      productList.insertAdjacentHTML("beforeend", productCard);
    });
  }
  
function setupCartButtons() {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      const product = products.find(p => p.id === id);
      const quantityInput = document.querySelector(`.quantity[data-id="${id}"]`);
      const quantity = parseInt(quantityInput.value) || 1;

      let cart = getCart();
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }

      saveCart(cart);
      location.reload(); // refresh to update cart count
    });
  });
}
    
    // Initialize
    renderHeader();
    renderProducts();
    setupCartButtons();