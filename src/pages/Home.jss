import { products } from "../products";
import { Heart, ShoppingCart } from "lucide-react";

function Home() {
  return (
    <div>
      <section className="hero">
        <div>
          <p className="hero-tag">WELCOME TO SHOPEASY</p>

          <h1>
            Find what you love.
            <br />
            Shop with confidence.
          </h1>

          <p>
            Discover quality products at great prices,
            all in one place.
          </p>

          <button className="shop-btn">
            Shop Now
          </button>
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <div>
            <p className="section-label">OUR COLLECTION</p>
            <h2>Featured Products</h2>
          </div>

          <button className="view-all">
            View All →
          </button>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>

              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                />

                <button className="wishlist-btn">
                  <Heart size={20} />
                </button>
              </div>

              <div className="product-content">
                <p>{product.category}</p>

                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <strong>₹{product.price}</strong>

                <button
  className="cart-btn"
  title="Add to Cart"
  onClick={() => addToCart(product)}
>
  <ShoppingCart size={18} />
  Add to Cart
</button>
              </div>

            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;