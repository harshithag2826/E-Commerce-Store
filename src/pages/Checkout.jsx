import { useState } from "react";
import { ArrowLeft, Minus, Plus, CheckCircle, MapPin, Phone, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../utils/productLocalization";

function Checkout({ product, onBack }) {
  const { t, i18n } = useTranslation();
  const localizedProduct = getLocalizedProduct(product, i18n.language);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pin: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalPrice = product.price * quantity;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <section className="checkout-section">
        <div className="order-success">

          <CheckCircle size={65} />

          <h1>{t("checkout.success")}</h1>

          <p>
            {t("checkout.thanks")}
          </p>

          <p>
            {t("checkout.orderFor", { name: localizedProduct.name })}
          </p>

          <button onClick={onBack}>
            {t("checkout.continue")}
          </button>

        </div>
      </section>
    );
  }

  return (
    <section className="checkout-section">

      {/* Back */}
      <button
        className="back-btn"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        {t("checkout.back")}
      </button>

      <div className="checkout-container">

        {/* ========================= */}
        {/* PRODUCT DETAILS */}
        {/* ========================= */}

        <div className="checkout-product">

          <p className="checkout-label">
            {t("checkout.productDetails")}
          </p>

          <img
            src={product.image}
            alt={localizedProduct.name}
          />

          <p className="checkout-category">
            {localizedProduct.category}
          </p>

          <h2>{localizedProduct.name}</h2>

          <p className="checkout-description">
            {localizedProduct.description}
          </p>

          <div className="checkout-price">
            ₹{product.price}
          </div>

          {/* Product information */}
          <div className="product-details-box">

            <h3>{t("checkout.productInformation")}</h3>

            <div className="detail-row">
              <span>{t("product.category")}</span>
              <strong>{localizedProduct.category}</strong>
            </div>

            <div className="detail-row">
              <span>{t("product.availability")}</span>
              <strong>
                {product.stock > 0
                  ? `${product.stock} ${t("product.available")}`
                  : t("product.inStock")}
              </strong>
            </div>

          </div>

          {/* Size */}
          {[
            "Fashion",
            "Footwear",
          ].includes(product.category?.en || product.category) && (
            <div className="option-group">

              <label>{t("checkout.size")}</label>

              <select
                value={size}
                onChange={(e) =>
                  setSize(e.target.value)
                }
                required
              >
                <option value="">
                {t("checkout.selectSize")}
                </option>

                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>

            </div>
          )}

          {/* Color */}
          <div className="option-group color-option-group">
            <label>{t("product.color")} <span>{color ? t(`colors.${color}`) : t("checkout.selectColor")}</span></label>
            <div className="checkout-color-options">
              {["Black", "White", "Blue", "Red", "Grey", "Brown"].map((colorName) => (
                <button
                  type="button"
                  key={colorName}
                  className={color === colorName ? "checkout-color selected" : "checkout-color"}
                  data-color={colorName.toLowerCase()}
                  aria-label={`${t("checkout.selectColor")}: ${t(`colors.${colorName}`)}`}
                  aria-pressed={color === colorName}
                  onClick={() => setColor(colorName)}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="quantity-section">

              <span>{t("checkout.quantity")}</span>

            <div className="checkout-quantity">

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    Math.max(1, quantity - 1)
                  )
                }
              >
                <Minus size={16} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(quantity + 1)
                }
              >
                <Plus size={16} />
              </button>

            </div>

          </div>

        </div>

        {/* ========================= */}
        {/* DELIVERY DETAILS */}
        {/* ========================= */}

        <div className="checkout-form">

          <p className="checkout-label">{t("checkout.delivery")}</p>

          <h2>{t("checkout.where")}</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group form-group-with-icon">
              <label><User size={15} /> {t("checkout.fullName")}</label>

              <input
                type="text"
                name="name"
                placeholder={t("checkout.namePlaceholder")}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group form-group-with-icon">
              <label><Phone size={15} /> {t("checkout.phone")}</label>

              <input
                type="tel"
                name="phone"
                placeholder={t("checkout.phonePlaceholder")}
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group form-group-with-icon">
              <label><MapPin size={15} /> {t("checkout.address")}</label>

              <textarea
                name="address"
                placeholder={t("checkout.addressPlaceholder")}
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>{t("checkout.city")}</label>

                <input
                  type="text"
                  name="city"
                  placeholder={t("checkout.cityPlaceholder")}
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t("checkout.pin")}</label>

                <input
                  type="text"
                  name="pin"
                  placeholder={t("checkout.pinPlaceholder")}
                  value={formData.pin}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Order Summary */}

            <div className="order-summary">

              <h3>{t("checkout.orderSummary")}</h3>

              <div>
                <span>{t("checkout.product")}</span>
                <span>{localizedProduct.name}</span>
              </div>

              <div>
                <span>{t("checkout.price")}</span>
                <span>₹{product.price}</span>
              </div>

              <div>
                <span>{t("checkout.quantity")}</span>
                <span>{quantity}</span>
              </div>

              <div className="summary-total">
                <strong>{t("cart.total")}</strong>
                <strong>₹{totalPrice}</strong>
              </div>

            </div>

            <button
              type="submit"
              className="place-order-btn"
            >
              {t("checkout.placeOrder")} • ₹{totalPrice}
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default Checkout;