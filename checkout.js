function getCart() {
    // try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    // } catch (e) {
    //   return []; // fallback if corrupted
    // }
  }

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}


function updateCartCount() {
    const cart = getCart();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0); 
    const cartCountElem = document.querySelector(".cart-count");
    if (cartCountElem) {
      cartCountElem.textContent = cartCount;
    }
  }

function renderHeader() {

    const headerHTML = `
    <header class="d-flex justify-content-between align-items-center px-3">
    <div class="d-flex align-items-center">
    <a href="index.html">
      <img src="image/AmazonLogo.png" alt="Amazon" class="logo me-3">
      </a>
      <input type="text" class="form-control me-2" placeholder="Search">
      <button class="btn btn-warning">Search</button>
    </div>

    <div class="d-flex align-items-center">
    <!-- Returns & Orders -->
    <div class="me-4 text-white text-center">
      <div style="font-size: 12px;">Returns</div>
      <div style="font-weight: bold;">& Orders</div>
    </div>

    <a href="checkout.html" class="cart-icon text-white text-decoration-none position-relative">
          <img src="image/amazon_cart.png" alt="Cart" width="80">
          <span class="cart-count">0</span>
          <span style="font-weight:bold; margin-left:-28px;">Cart</span>
        </a>
      </div>
    </header>
   `;
  document.body.insertAdjacentHTML("afterbegin", headerHTML);

  updateCartCount();
}

renderHeader();