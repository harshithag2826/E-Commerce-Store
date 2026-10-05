import { useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../utils/productLocalization";

function Wishlist({ wishlist, toggleWishlist, addToCart }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [addedProducts, setAddedProducts] = useState({});
  const getProductId = (product) => String(product._id ?? product.id);

  const handleAddToCart = (product) => {
    const productId = getProductId(product);

    addToCart(product);
    setAddedProducts((current) => ({ ...current, [productId]: true }));

    setTimeout(() => {
      setAddedProducts((current) => ({ ...current, [productId]: false }));
    }, 2500);
  };

  return (
    <section className="collection-page wishlist-page">
      <div className="section-heading">
        <div>
          <p className="section-label">{t("wishlist.saved")}</p>
          <h2>{t("wishlist.title")}</h2>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-page">
          <Heart size={48} />
          <h3>{t("wishlist.empty")}</h3>
          <p>{t("wishlist.emptyText")}</p>
        </div>
      ) : (
        <div className="saved-list">
          {wishlist.map((product) => {
            const localizedProduct = getLocalizedProduct(product, i18n.language);
            return (
            <article
              className="saved-item"
              key={getProductId(product)}
              onClick={() => navigate(`/product/${getProductId(product)}`)}
            >
              <img src={localizedProduct.image} alt={localizedProduct.name} />
              <div className="saved-item-info">
                <p>{localizedProduct.category}</p>
                <h3>{localizedProduct.name}</h3>
                <strong>₹{product.price}</strong>
                <div className="saved-item-actions">
                  <button className="cart-btn" onClick={(event) => { event.stopPropagation(); handleAddToCart(product); }}>
                    <ShoppingCart size={17} /> {addedProducts[getProductId(product)] ? t("home.added") : t("home.addToCart")}
                  </button>
                  <button className="remove-cart" onClick={(event) => { event.stopPropagation(); toggleWishlist(product); }}>
                    <Trash2 size={16} /> {t("cart.remove")}
                  </button>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
