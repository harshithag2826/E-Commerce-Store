import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import "./App.css";

function App() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopeasy-cart")) || [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopeasy-wishlist")) || [];
    } catch {
      return [];
    }
  });
  const [buyNowProduct, setBuyNowProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem("shopeasy-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("shopeasy-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const getProductId = (product) => String(product._id ?? product.id);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => getProductId(item) === getProductId(product)
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          getProductId(item) === getProductId(product)
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        getProductId(item) === String(id)
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          getProductId(item) === String(id)
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => getProductId(item) !== String(id))
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) => {
      const alreadyExists = currentWishlist.some(
        (item) => getProductId(item) === getProductId(product)
      );

      if (alreadyExists) {
        return currentWishlist.filter(
          (item) => getProductId(item) !== getProductId(product)
        );
      }

      return [
        ...currentWishlist,
        product,
      ];
    });
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const handleBuyNow = (product) => {
    setBuyNowProduct(product);
  };

  const backToShopping = () => {
    setBuyNowProduct(null);
  };

  return (
    <div
      className={
        darkMode
          ? "app dark"
          : "app"
      }
    >

      <BrowserRouter>
        <AppContent
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          search={search}
          setSearch={setSearch}
          wishlist={wishlist}
          cart={cart}
          cartCount={cartCount}
          cartTotal={cartTotal}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          removeFromCart={removeFromCart}
          buyNow={handleBuyNow}
          buyNowProduct={buyNowProduct}
          onBack={backToShopping}
        />
      </BrowserRouter>

      <footer>
        <p>
          {t("footer")}
        </p>
      </footer>

    </div>
  );
}

function AppContent({
  darkMode,
  setDarkMode,
  search,
  setSearch,
  wishlist,
  cart,
  cartCount,
  cartTotal,
  toggleWishlist,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  buyNow,
  buyNowProduct,
  onBack,
}) {
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        search={search}
        setSearch={setSearch}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        onWishlist={() => navigate("/wishlist")}
        onCart={() => navigate("/cart")}
      />

      <main>
        {buyNowProduct ? (
          <Checkout product={buyNowProduct} onBack={onBack} />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  search={search}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  addToCart={addToCart}
                  buyNow={buyNow}
                />
              }
            />
            <Route
              path="/wishlist"
              element={
                <Wishlist
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  addToCart={addToCart}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  cartTotal={cartTotal}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  removeFromCart={removeFromCart}
                />
              }
            />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} buyNow={buyNow} toggleWishlist={toggleWishlist} />} />
            <Route path="*" element={<Home search={search} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} buyNow={buyNow} />} />
          </Routes>
        )}
      </main>
    </>
  );
}

export default App;