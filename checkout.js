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

const products = [
    {id: 1, name: "Black and Gray Socks 6 pair", price: 10.90, image: "image/socks.png"},
    {id: 2, name: "Medium size Basketball", price: 20.95, image: "image/basketball.png"},
    {id: 3, name: "Plain Blue T-shirt", price: 7.99, image: "image/T_shirt.png"},
    {id: 4, name: "Toaster", price: 19.99, image: "image/toaster.png"}
  ];

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


// checkout page 
function renderCheckout() {
    const cart = getCart();
    const container = document.getElementById("checkoutContainer");
  
    if (!cart.length) {
      container.innerHTML = `<h3>Your cart is empty</h3>`;
      return;
    }
  
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
    let leftHTML = `
    <h2>Checkout (${totalItems} items)</h2>
    <h4>Review your order</h4>
     `;
  
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;
      
      if (item.shipping === undefined) {
        item.shipping = 0;
        saveCart(cart);
      }
  
      const estDelivery = getEstimatedDelivery(item.shipping);
  
     
    leftHTML += `
    <div class="card mb-3 p-3">
        <div class="row g-3">
          <div class="col-md-2">
            <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
          </div>
          <div class="col-md-6">
            <h5>${product.name}</h5>
            <p class="text-muted est-delivery" data-id="${item.id}">
              Estimated delivery: ${estDelivery}
            </p>
            <p><strong>$${product.price.toFixed(2)}</strong></p>
            
            <label>Quantity:</label>
            <input type="number" min="1" value="${item.quantity}" 
              class="form-control quantity-input" data-id="${item.id}" style="width:80px;">
            
            <button class="btn btn-danger btn-sm mt-2 delete-btn" data-id="${item.id}">Delete</button>
          </div>

          <div class="col-md-4">
            <h6>Delivery options:</h6>
            <div><input type="radio" name="shipping-${item.id}" value="0" ${item.shipping==0?"checked":""}> Free Shipping</div>
            <div><input type="radio" name="shipping-${item.id}" value="4.99" ${item.shipping==4.99?"checked":""}> $4.99 Shipping</div>
            <div><input type="radio" name="shipping-${item.id}" value="9.99" ${item.shipping==9.99?"checked":""}> $9.99 Shipping</div>
          </div>
        </div>
      </div>
    `;
  });

  
    
     
  let rightHTML = `
  <div id="orderSummary" class="border p-3 rounded">
    <h4>Order Summary</h4>
    <p>Items: $${calculateItemsTotal(cart).toFixed(2)}</p>
    <p>Shipping & Handling: <span id="shippingCost">$0.00</span></p>
    <p>Total before tax: <span id="subtotal">$${calculateItemsTotal(cart).toFixed(2)}</span></p>
    <p>Estimated tax (10%): <span id="tax">$${(calculateItemsTotal(cart)*0.1).toFixed(2)}</span></p>
    <h5>Order Total: <span id="total"></span></h5>
    <button id="placeOrderBtn" class="btn btn-warning w-100 mt-2">Place your order</button>
  </div>
`;

  
container.innerHTML = `
<div class="row">
  <div class="col-md-8">${leftHTML}</div>
  <div class="col-md-4">${rightHTML}</div>
</div>
`;
  
    attachCheckoutListeners();
  }
  
  // ---- Helpers ----
  function getEstimatedDelivery(shippingCost) {
    const today = new Date();
    const deliveryDate = new Date();
    
    // add days depending on shipping speed
    if (shippingCost === 0) deliveryDate.setDate(today.getDate() + 7);
    else if (shippingCost === 4.99) deliveryDate.setDate(today.getDate() + 3);
    else if (shippingCost === 9.99) deliveryDate.setDate(today.getDate() + 1);
  
    return deliveryDate.toDateString();
  }
  
  function calculateItemsTotal(cart) {
    return cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }
  
  function calculateShippingTotal(cart) {
    return cart.reduce((sum, item) => sum + (item.shipping || 0), 0);
  }
  
  function attachCheckoutListeners() {
    // Quantity update
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("change", e => {
          const id = parseInt(e.target.dataset.id);
          const cart = getCart();
          const item = cart.find(i => i.id === id);
          if (item) {
            item.quantity = parseInt(e.target.value) || 1;
            saveCart(cart);
            updateCartCount();
            renderCheckout();
          }
        });
      });
  
    // Delete
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id);
        let cart = getCart().filter(i => i.id !== id);
        saveCart(cart);
        updateCartCount();
        renderCheckout();
      });
    });
  
    // Shipping selection
    document.querySelectorAll("input[type='radio'][name^='shipping-']").forEach(radio => {
        radio.addEventListener("change", e => {
            const [_, id] = e.target.name.split("-");
            const cart = getCart();
            const item = cart.find(i => i.id === parseInt(id));
            if (item) {
              item.shipping = parseFloat(e.target.value);
              saveCart(cart);
      
              // update delivery date for this item
              const estElem = document.querySelector(`.est-delivery[data-id='${id}']`);
              if (estElem) estElem.textContent = "Estimated delivery: " + getEstimatedDelivery(item.shipping);
      
              updateSummary();
            }
          });
        });
  
    // Place order
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", () => {
        alert(" Order placed successfully!");
        saveCart([]); // clear cart
        updateCartCount();
        renderCheckout();
      });
    }
  
    updateSummary();
  }
  
  function updateSummary() {
    const cart = getCart();

    const shipping = calculateItemsTotal(cart);
    const itemsTotal = calculateShippingTotal(cart);
    const subtotal = itemsTotal + shipping;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
  
    document.getElementById("shippingCost").textContent = `$${shipping.toFixed(2)}`;
    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  }
  

  renderHeader();
  renderCheckout(); 