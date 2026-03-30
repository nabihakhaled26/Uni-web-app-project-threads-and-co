import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { showProducts } from "./controllers/P2879363productController.js";
import {
  showWishlist,
  handleAddToWishlist,
  handleRemoveFromWishlist
} from "./controllers/P2879363wishlistController.js";
import {
  showCart,
  handleAddToCart,
  handleIncreaseCartItem,
  handleDecreaseCartItem,
  handleRemoveFromCart
} from "./controllers/P2879363cartController.js";
import { placeOrder } from "./controllers/P2879363orderController.js";
import { seedProducts, getProductById } from "./model/P2879363productModel.js";
import "./model/P2879363db.js";

seedProducts();

async function renderTemplate(filePath, replacements) {
  let html = await Deno.readTextFile(filePath);

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  return html;
}

function redirect(location) {
  return new Response(null, {
    status: 303,
    headers: { Location: location }
  });
}

function htmlResponse(html) {
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildProductCards(products, selectedCategory) {
  return products.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-category">${capitalize(product.category)}</p>
        <p class="product-price">AED ${product.price}</p>
      </div>
      <div class="product-actions">
        <form action="/cart/add" method="POST">
          <input type="hidden" name="productId" value="${product.id}">
          <input type="hidden" name="selectedCategory" value="${selectedCategory}">
          <button type="submit" class="primary-btn">Add to cart</button>
        </form>

        <form action="/wishlist/add" method="POST">
          <input type="hidden" name="productId" value="${product.id}">
          <input type="hidden" name="selectedCategory" value="${selectedCategory}">
          <button type="submit" class="wishlist-btn">♡</button>
        </form>
      </div>
    </article>
  `).join("");
}

function buildWishlistContent(wishlist) {
  if (wishlist.length === 0) {
    return `
      <div class="empty-state">
        <h2>Your wishlist is empty</h2>
        <p>Save items here to review them later.</p>
        <a href="P2" class="primary-link-btn">Browse products></a>
      </div>
    `;
  }

  return `
    <div class="wishlist-table">
      <div class="wishlist-head">
        <span>Product</span>
        <span>Price</span>
        <span>Actions</span>
      </div>
      ${wishlist.map((item) => `
        <div class="wishlist-row">
          <div class="wishlist-product">
            <div class="wishlist-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div>
              <h3>${item.name}</h3>
              <p>${capitalize(item.category)}</p>
            </div>
          </div>

          <div class="wishlist-price">AED ${item.price}</div>

          <div class="wishlist-actions">
            <form action="/cart/add" method="POST">
              <input type="hidden" name="productId" value="${item.product_id}">
              <input type="hidden" name="selectedCategory" value="all">
              <button type="submit" class="primary-btn">Add to cart</button>
            </form>

            <form action="/wishlist/remove" method="POST">
              <input type="hidden" name="productId" value="${item.product_id}">
              <button type="submit" class="danger-btn">Remove</button>
            </form>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function buildCheckoutContent(cartData, message) {
  const { items, subtotal, shipping, tax, total } = cartData;

  if (items.length === 0) {
    return `
      <section class="empty-cart-card">
        <h1>Your Shopping Cart is Empty</h1>
        <p>Looks like you haven’t added anything yet.</p>
        <a href="/product" class="primary-link-btn">Click here to shop</a>
      </section>
    `;
  }

  const alert = message ? `<div class="alert neutral-alert">${message}</div>` : "";

  return `
    <section class="checkout-layout">
      <div class="cart-panel">
        <div class="section-top">
          <h1>Your Cart</h1>
        </div>
        ${alert}

        ${items.map((item) => `
          <div class="cart-row">
            <div class="cart-product">
              <div class="cart-image">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="cart-details">
                <h3>${item.name}</h3>
                <p>${capitalize(item.category)}</p>
                <p class="product-price">AED ${item.price}</p>
              </div>
            </div>

            <div class="cart-controls">
              <div class="quantity-box">
                <form action="/cart/decrease" method="POST">
                  <input type="hidden" name="productId" value="${item.product_id}">
                  <button type="submit" class="qty-btn">−</button>
                </form>

                <span class="qty-value">${item.quantity}</span>

                <form action="/cart/increase" method="POST">
                  <input type="hidden" name="productId" value="${item.product_id}">
                  <button type="submit" class="qty-btn">+</button>
                </form>
              </div>

              <form action="/cart/remove" method="POST">
                <input type="hidden" name="productId" value="${item.product_id}">
                <button type="submit" class="text-link-btn">Remove</button>
              </form>
            </div>
          </div>
        `).join("")}
      </div>

      <aside class="summary-panel">
        <h2>Order Summary</h2>

        <div class="summary-row"><span>Subtotal</span><span>AED ${subtotal}</span></div>
        <div class="summary-row"><span>Shipping</span><span>AED ${shipping}</span></div>
        <div class="summary-row"><span>Tax</span><span>AED ${tax}</span></div>
        <hr>
        <div class="summary-row total-row"><span>Total</span><span>AED ${total}</span></div>

        <form action="/checkout/place-order" method="POST">
          <button type="submit" class="place-order-btn">Place Order</button>
        </form>
      </aside>
    </section>
  `;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/css") || url.pathname.startsWith("/images")) {
    return serveDir(req, {
      fsRoot: "./",
      urlRoot: ""
    });
  }

  if (req.method === "GET" && url.pathname === "/") {
    return redirect("/product");
  }

  if (req.method === "GET" && url.pathname === "/product") {
    const { products, selectedCategory, categoryTitle } = showProducts(url);
    const added = url.searchParams.get("added") || "";
    const name = url.searchParams.get("name") || "";

    const alert =
      added === "cart"
        ? `<div class="alert success-alert"><strong>${name}</strong> has been added to your cart.</div>`
        : added === "wishlist"
        ? `<div class="alert success-alert"><strong>${name}</strong> has been added to your wishlist.</div>`
        : "";

    const html = await renderTemplate("./P2879363product.html", {
      PRODUCT_CARDS: buildProductCards(products, selectedCategory),
      CATEGORY_ALL: selectedCategory === "all" ? "active" : "",
      CATEGORY_WOMEN: selectedCategory === "women" ? "active" : "",
      CATEGORY_GIRL: selectedCategory === "girl" ? "active" : "",
      CATEGORY_ACCESSORIES: selectedCategory === "accessories" ? "active" : "",
      CATEGORY_TITLE: categoryTitle,
      ALERT: alert
    });

    return htmlResponse(html);
  }

  if (req.method === "POST" && url.pathname === "/cart/add") {
    const formData = await req.formData();
    const productId = Number(formData.get("productId"));
    const selectedCategory = String(formData.get("selectedCategory") || "all");

    handleAddToCart(productId);
    const product = getProductById(productId);
    const name = product ? product.name : "Item";

    return redirect(`/product?category=${selectedCategory}&added=cart&name=${encodeURIComponent(name)}`);
  }

  if (req.method === "GET" && url.pathname === "/wishlist") {
    const { wishlist } = showWishlist();

    const html = await renderTemplate("./P2879363wishlist.html", {
      WISHLIST_CONTENT: buildWishlistContent(wishlist)
    });

    return htmlResponse(html);
  }

  if (req.method === "POST" && url.pathname === "/wishlist/add") {
    const formData = await req.formData();
    const productId = Number(formData.get("productId"));
    const selectedCategory = String(formData.get("selectedCategory") || "all");

    handleAddToWishlist(productId);
    const product = getProductById(productId);
    const name = product ? product.name : "Item";

    return redirect(`/product?category=${selectedCategory}&added=wishlist&name=${encodeURIComponent(name)}`);
  }

  if (req.method === "POST" && url.pathname === "/wishlist/remove") {
    const formData = await req.formData();
    const productId = Number(formData.get("productId"));
    handleRemoveFromWishlist(productId);
    return redirect("/wishlist");
  }

  if (req.method === "GET" && url.pathname === "/checkout") {
    const cartData = showCart();
    const message = url.searchParams.get("message") || "";

    const html = await renderTemplate("./P2879363checkout.html", {
      CHECKOUT_CONTENT: buildCheckoutContent(cartData, message)
    });

    return htmlResponse(html);
  }

  if (req.method === "POST" && url.pathname === "/cart/increase") {
    const formData = await req.formData();
    const productId = Number(formData.get("productId"));
    handleIncreaseCartItem(productId);
    return redirect("/checkout");
  }

  if (req.method === "POST" && url.pathname === "/cart/decrease") {
    const formData = await req.formData();
    const productId = Number(formData.get("productId"));
    handleDecreaseCartItem(productId);
    return redirect("/checkout");
  }

  if (req.method === "POST" && url.pathname === "/cart/remove") {
    const formData = await req.formData();
    const productId = Number(formData.get("productId"));
    handleRemoveFromCart(productId);
    return redirect("/checkout?message=Item removed from cart.");
  }

  if (req.method === "POST" && url.pathname === "/checkout/place-order") {
    placeOrder();
    return redirect("/thank-you");
  }

  if (req.method === "GET" && url.pathname === "/thank-you") {
    const html = await renderTemplate("./P2879363thank-you.html", {});
    return htmlResponse(html);
  }

  return new Response("Not Found", { status: 404 });
});