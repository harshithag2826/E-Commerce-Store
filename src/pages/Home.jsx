import { useState } from "react";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { products as staticProducts } from "../products";
import { getLocalizedProducts } from "../utils/productLocalization";

function Home({
  search = "",
  wishlist = [],
  toggleWishlist = () => {},
  addToCart = () => {},
  buyNow = () => {},
}) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [addedProduct, setAddedProduct] = useState(null);

  /*
   * Use products from products.js instead of MongoDB.
   *
   * Your products.js has `id`.
   * Your existing app uses `_id`.
   * So we create `_id` from `id` to keep
   * Cart/Wishlist/Product navigation compatible.
   */
  const products = staticProducts.map((product) => ({
    ...product,
    _id: String(product.id),
  }));

  // Localize products
  const localizedProducts = getLocalizedProducts(
    products,
    i18n.language
  );

  // Search products
  const filteredProducts = localizedProducts.filter((product) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      product.name?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText) ||
      product.description?.toLowerCase().includes(searchText)
    );
  });

  // Check wishlist
  const isWishlisted = (productId) => {
    return wishlist.some(
      (item) => String(item._id || item.id) === String(productId)
    );
  };

  // Add to cart
  const handleAddToCart = (product) => {
    addToCart(product);

    setAddedProduct(product._id);

    setTimeout(() => {
      setAddedProduct(null);
    }, 1500);
  };

  // Buy Now
  const handleBuyNow = (product) => {
    buyNow(product);
  };

  return (
    <div>
      {/* ================= HERO SECTION ================= */}

      <section className="hero">
        <div>
          <p className="hero-tag">
            {t("home.welcome")}
          </p>

          <h1>
            {t("home.heroTitle")}
            <br />
            {t("home.heroTitleSecond")}
          </h1>

          <p>
            {t("home.heroText")}
          </p>

          <button
            className="shop-btn"
            onClick={() => {
              document
                .querySelector(".products-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            {t("home.shopNow")}
          </button>
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}

      <section className="products-section">

        {/* Heading */}

        <div className="section-heading">
          <div>
            <p className="section-label">
              {t("home.collection")}
            </p>

            <h2>
              {search
                ? t("home.searchResults", { search })
                : t("home.featured")}
            </h2>
          </div>

          <button
            className="view-all"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {t("home.viewAll")}
          </button>
        </div>

        {/* Product Count */}

        <p
          style={{
            marginBottom: "20px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          {filteredProducts.length} products available
        </p>

        {/* ================= PRODUCT GRID ================= */}

        {filteredProducts.length > 0 ? (
          <div className="product-grid">

            {filteredProducts.map((product) => (
              <div
                className="product-card"
                key={product._id}
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
              >

                {/* Product Image */}

                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://via.placeholder.com/500x500?text=Product";
                    }}
                  />

                  {/* Wishlist */}

                  <button
                    className="wishlist-btn"
                    title={
                      isWishlisted(product._id)
                        ? t("home.removeWishlist")
                        : t("home.addWishlist")
                    }
                    onClick={(event) => {
                      event.stopPropagation();

                      toggleWishlist(product);
                    }}
                  >
                    <Heart
                      size={20}
                      fill={
                        isWishlisted(product._id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                </div>

                {/* Product Information */}

                <div className="product-content">

                  {/* Category */}

                  <p>
                    {product.category}
                  </p>

                  {/* Name */}

                  <h3>
                    {product.name}
                  </h3>

                  {/* Description */}

                  <p>
                    {product.description}
                  </p>

                  {/* Price */}

                  <strong>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </strong>

                  {/* Add To Cart */}

                  <button
                    className="cart-btn"
                    title={t("home.addToCart")}
                    onClick={(event) => {
                      event.stopPropagation();

                      handleAddToCart(product);
                    }}
                  >
                    {addedProduct === product._id ? (
                      t("home.added")
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        {t("home.addToCart")}
                      </>
                    )}
                  </button>

                  {/* Buy Now */}

                  <button
                    className="buy-now-btn"
                    title={t("home.buyNow")}
                    onClick={(event) => {
                      event.stopPropagation();

                      handleBuyNow(product);
                    }}
                  >
                    <Zap size={18} />

                    {t("home.buyNow")}
                  </button>

                </div>

              </div>
            ))}

          </div>
        ) : (

          /* ================= NO PRODUCTS ================= */

          <div className="no-products">

            <h3>
              {t("home.noProducts")}
            </h3>

            <p>
              {t("home.tryAnother")}
            </p>

          </div>
        )}

      </section>
    </div>
  );
}

export default Home;