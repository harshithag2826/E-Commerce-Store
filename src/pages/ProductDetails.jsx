import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct, getLocalizedProducts } from "../utils/productLocalization";

function ProductDetails({ addToCart, buyNow, toggleWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);

  const colors = [
    { name: "Black", value: "#171717" },
    { name: "White", value: "#f8fafc" },
    { name: "Blue", value: "#2563eb" },
    { name: "Red", value: "#dc2626" },
    { name: "Grey", value: "#9ca3af" },
    { name: "Brown", value: "#92400e" },
  ];

  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setProduct(data.find((item) => String(item._id ?? item.id) === String(id)));
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const localizedProduct = product ? getLocalizedProduct(product, i18n.language) : null;
  const localizedProducts = getLocalizedProducts(products, i18n.language);
  const similarProducts = useMemo(
    () => localizedProducts.filter((item) => String(item._id ?? item.id) !== String(id) && item.category === localizedProduct?.category).slice(0, 4),
    [id, localizedProduct, localizedProducts]
  );

  const addSelectedToCart = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }
  };

  if (loading) return <section className="product-details-page"><p>{t("product.loading")}</p></section>;
  if (!product) return <section className="product-details-page"><h2>{t("product.notFound")}</h2><button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={18} /> {t("product.back")}</button></section>;

  return (
    <section className="product-details-page product-details-modern">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> {t("product.back")}
      </button>
      <div className="product-details-content">
        <div className="product-image-card">
          <img src={localizedProduct.image} alt={localizedProduct.name} />
        </div>

        <div className="product-details-info">
          <div className="product-details-heading">
            <p className="section-label">{localizedProduct.category}</p>
            <h1>{localizedProduct.name}</h1>
            <div className="product-rating" aria-label={t("product.rating")}>
              <span>★★★★★</span>
              <small>{t("product.rating")}</small>
            </div>
          </div>

          <p className="product-details-description">{localizedProduct.description}</p>

          <div className="product-details-price-row">
            <strong className="product-details-price">₹{product.price}</strong>
            <span className="product-original-price">₹{Math.round(product.price * 1.2)}</span>
            <span className="product-discount">20% off</span>
            {product.stock !== undefined && (
              <span className="product-availability">
                <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
                  {product.stock > 0 ? t("product.inStock") : t("product.outOfStock")}
                </span>
              </span>
            )}
          </div>

          <div className="product-option-group">
            <div className="product-option-heading">
              <strong>{t("product.color")}</strong>
              <span>{t(`colors.${selectedColor}`)}</span>
            </div>
            <div className="color-options">
              {colors.map((color) => (
                <button
                  type="button"
                  key={color.name}
                  className={selectedColor === color.name ? "color-swatch selected" : "color-swatch"}
                  style={{ "--swatch-color": color.value }}
                  aria-label={`${t("product.selectColor")}: ${t(`colors.${color.name}`)}`}
                  aria-pressed={selectedColor === color.name}
                  onClick={() => setSelectedColor(color.name)}
                />
              ))}
            </div>
          </div>

          <div className="product-option-group quantity-option">
            <strong>{t("product.quantity")}</strong>
            <div className="product-quantity">
                <button type="button" aria-label={t("cart.decrease", { name: localizedProduct.name })} onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
                <button type="button" aria-label={t("cart.increase", { name: localizedProduct.name })} onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="product-details-actions">
            <button className="cart-btn" onClick={addSelectedToCart}>
              <ShoppingCart size={18} /> {t("home.addToCart")}
            </button>
            <button className="buy-now-btn" onClick={() => buyNow(product)}>
              <Zap size={18} /> {t("home.buyNow")}
            </button>
            <button className="wishlist-detail-btn" title={t("nav.wishlist")} aria-label={t("home.addWishlist")} onClick={() => toggleWishlist(product)}>
              <Heart size={19} /> <span>{t("home.addWishlist")}</span>
            </button>
          </div>

          <div className="product-details-box">
            <h2>{t("product.information")}</h2>
            <div className="detail-row">
              <span>{t("product.category")}</span>
              <strong>{localizedProduct.category}</strong>
            </div>
            {product.stock !== undefined && (
              <div className="detail-row">
                <span>{t("product.availability")}</span>
                <strong>{product.stock > 0 ? t("product.available") : t("product.outOfStock")}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="product-extra-sections">
        <section className="product-extra-card">
          <div className="extra-card-heading"><Star size={18} /><h2>{t("product.features")}</h2></div>
          <ul>
            <li>{localizedProduct.description}</li>
            <li>{t("product.everydayUse", { category: localizedProduct.category.toLowerCase() })}</li>
            {product.stock !== undefined && <li>{product.stock > 0 ? t("product.availableToOrder") : t("product.availabilitySoon")}</li>}
          </ul>
        </section>

        <section className="product-extra-card">
          <div className="extra-card-heading"><h2>{t("product.specifications")}</h2></div>
          <div className="specification-list">
            <div><span>{t("product.category")}</span><strong>{localizedProduct.category}</strong></div>
            <div><span>{t("product.availability")}</span><strong>{product.stock > 0 ? t("product.inStock") : t("product.outOfStock")}</strong></div>
          </div>
        </section>

        <section className="product-extra-card reviews-card">
          <div className="extra-card-heading"><Star size={18} /><h2>{t("product.reviews")}</h2></div>
          <div className="review-summary"><span>★★★★★</span><strong>5.0</strong><small>{t("product.firstReview")}</small></div>
        </section>
      </div>

      {similarProducts.length > 0 && (
        <section className="similar-products">
          <div className="section-heading"><div><p className="section-label">{t("product.youMayLike")}</p><h2>{t("product.similar")}</h2></div></div>
          <div className="similar-product-grid">
            {similarProducts.map((similarProduct) => {
              const similarId = String(similarProduct._id ?? similarProduct.id);
              return (
                <button type="button" className="similar-product-card" key={similarId} onClick={() => navigate(`/product/${similarId}`)}>
                  <img src={similarProduct.image} alt={similarProduct.name} />
                  <span>{similarProduct.name}</span>
                  <strong>₹{similarProduct.price}</strong>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
}

export default ProductDetails;
