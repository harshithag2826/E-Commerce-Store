import {
  ShoppingCart,
  Heart,
  Search,
  Moon,
  Sun,
  Globe,
  Bell,
  User,
  Mic,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";
import useVoiceSearch from "../hooks/useVoiceSearch";

function Navbar({
  darkMode,
  setDarkMode,
  search,
  setSearch,
  wishlistCount,
  cartCount,
  onWishlist,
  onCart,
}) {
  const { t } = useTranslation();
  const { isListening, error: voiceError, toggleListening } = useVoiceSearch(
    i18n.language,
    setSearch
  );
  const languages = [
    { code: "en", name: "English" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "hi", name: "हिन्दी" },
    { code: "te", name: "తెలుగు" },
    { code: "ta", name: "தமிழ்" },
    { code: "ml", name: "മലയാളം" },
  ];

  return (
    <header className="navbar">
      <div className="logo">🛍️ Shopeasy</div>

      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder={t("nav.search")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button
          type="button"
          className={`voice-search-btn ${isListening ? "is-listening" : ""}`}
          onClick={toggleListening}
          title={isListening ? t("nav.voiceListening") : t("nav.voiceSearch")}
          aria-label={isListening ? t("nav.voiceListening") : t("nav.voiceSearch")}
        >
          <Mic size={19} />
        </button>
        {voiceError && <span className="voice-search-message" role="alert">{voiceError}</span>}
      </div>

      <div className="nav-actions">
        <div className="language-selector">
          <Globe size={19} />
          <select value={i18n.language} onChange={(event) => i18n.changeLanguage(event.target.value)} aria-label={t("nav.search")}>
            {languages.map((language) => (
              <option key={language.code} value={language.code}>{language.name}</option>
            ))}
          </select>
        </div>

        <button onClick={() => setDarkMode(!darkMode)} title={t("nav.toggleDark")}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="notification-btn" title={t("nav.notifications")}>
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <button className="wishlist-nav" title={t("nav.wishlist")} onClick={onWishlist}>
          <Heart size={20} />
          {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
        </button>

        <button className="cart-icon" title={t("nav.cart")} onClick={onCart}>
          <ShoppingCart size={20} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        <button className="login-btn">
          <User size={17} />
          {t("nav.login")}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
