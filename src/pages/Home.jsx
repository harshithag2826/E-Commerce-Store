import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const [products, setProducts] = useState([]);
  const [addedProduct, setAddedProduct] = useState(null);

  // Fetch products from Express + MongoDB
  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Search / filter products
  const localizedProducts = getLocalizedProducts(products, i18n.language);
  const filteredProducts = localizedProducts.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText)
    );
  });

  // Check wishlist
  const isWishlisted = (productId) => {
    return wishlist.some(
      (item) => item._id === productId
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

      {/* Hero Section */}
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

          <button className="shop-btn">
            {t("home.shopNow")}
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">

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

          <button className="view-all">
            {t("home.viewAll")}
          </button>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (

          <div className="product-grid">

            {filteredProducts.map((product) => (

              <div
                className="product-card"
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >

                {/* Product Image */}
                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.name}
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

                  <p>
                    {product.category}
                  </p>

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description}
                  </p>

                  <strong>
                    ₹{product.price}
                  </strong>

                  {/* Add to Cart */}
                  <button
                    className="cart-btn"
                    title={t("home.addToCart")}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    {addedProduct === product._id ? (
                      <>
                        {t("home.added")}
                      </>
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

          /* No Products */
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