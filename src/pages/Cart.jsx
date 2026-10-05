import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../utils/productLocalization";

function Cart({ cart, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const getProductId = (product) => String(product._id ?? product.id);

  return (
    <section className="collection-page cart-page">
      <div className="section-heading">
        <div>
          <p className="section-label">{t("cart.ready")}</p>
          <h2>{t("cart.title")}</h2>
        </div>
        {cart.length > 0 && <strong className="cart-page-total">{t("cart.total")}: ₹{cartTotal}</strong>}
      </div>

      {cart.length === 0 ? (
        <div className="empty-page">
          <ShoppingCart size={48} />
          <h3>{t("cart.empty")}</h3>
          <p>{t("cart.emptyText")}</p>
        </div>
      ) : (
        <div className="saved-list">
          {cart.map((product) => {
            const productId = getProductId(product);
            const localizedProduct = getLocalizedProduct(product, i18n.language);
            return (
              <article className="saved-item" key={productId} onClick={() => navigate(`/product/${productId}`)}>
                <img src={localizedProduct.image} alt={localizedProduct.name} />
                <div className="saved-item-info">
                  <p>{localizedProduct.category}</p>
                  <h3>{localizedProduct.name}</h3>
                  <strong>₹{product.price}</strong>
                  <p className="item-subtotal">{t("cart.subtotal")}: ₹{product.price * product.quantity}</p>
                  <div className="saved-item-actions">
                    <div className="quantity-controls" onClick={(event) => event.stopPropagation()}>
                      <button aria-label={t("cart.decrease", { name: localizedProduct.name })} onClick={() => decreaseQuantity(productId)}><Minus size={16} /></button>
                      <span>{product.quantity}</span>
                      <button aria-label={t("cart.increase", { name: localizedProduct.name })} onClick={() => increaseQuantity(productId)}><Plus size={16} /></button>
                    </div>
                    <button className="remove-cart" onClick={(event) => { event.stopPropagation(); removeFromCart(productId); }}>
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

export default Cart;
