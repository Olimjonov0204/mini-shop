import { useMemo, useState } from "react";

const PRODUCTS = [
  { id: "p1", name: "Headphones", price: 25 },
  { id: "p2", name: "Keyboard", price: 35 },
  { id: "p3", name: "Mouse", price: 15 },
  { id: "p4", name: "USB-C Cable", price: 9 },
  { id: "p5", name: "Laptop Stand", price: 22 },
  { id: "p6", name: "Webcam", price: 40 },
];

function money(n) {
  return "$" + n.toFixed(2);
}

export default function App() {
  const [cart, setCart] = useState([]); // [{id, name, price, qty}]
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  function addToCart(p) {
    setCart((prev) => {
      const found = prev.find((x) => x.id === p.id);
      if (found) return prev.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { ...p, qty: 1 }];
    });
  }

  function inc(id) {
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));
  }

  function dec(id) {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );
  }

  function remove(id) {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }

  function clear() {
    setCart([]);
    setPromo("");
    setPromoApplied(false);
  }

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    if (code === "SAVE10") {
      setPromoApplied(true);
      alert("Promo qo‘llandi: 10% chegirma!");
    } else {
      setPromoApplied(false);
      alert("Promo noto‘g‘ri. Demo kod: SAVE10");
    }
  }

  const calc = useMemo(() => {
    const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const tax = subtotal * 0.05; // 5% demo tax
    const discount = promoApplied ? subtotal * 0.10 : 0; // 10% promo
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  }, [cart, promoApplied]);

  return (
    <div className="container">
      <h1>Mini Shop</h1>
      <div className="grid">
        <div className="card">
          <h3>Products</h3>
          <div className="products">
            {PRODUCTS.map((p) => (
              <div className="pcard" key={p.id}>
                <div style={{ fontWeight: 900 }}>{p.name}</div>
                <div className="price" style={{ margin: "6px 0" }}>{money(p.price)}</div>
                <button onClick={() => addToCart(p)}>Add to cart</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Cart</h3>

          {cart.length === 0 ? (
            <p className="small">Cart bo‘sh. Mahsulot qo‘shing.</p>
          ) : (
            <>
              {cart.map((x) => (
                <div key={x.id} style={{ marginBottom: 10 }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 900 }}>{x.name}</div>
                      <div className="small">{money(x.price)} × {x.qty} = {money(x.price * x.qty)}</div>
                    </div>
                    <button className="danger" onClick={() => remove(x.id)}>Remove</button>
                  </div>
                  <div className="row" style={{ marginTop: 8 }}>
                    <button className="secondary" onClick={() => dec(x.id)}>-</button>
                    <span style={{ minWidth: 24, textAlign: "center" }}>{x.qty}</span>
                    <button className="secondary" onClick={() => inc(x.id)}>+</button>
                  </div>
                </div>
              ))}
            </>
          )}

          <hr />

          <div className="row">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code (SAVE10)"
              style={{ flex: 1, minWidth: 180 }}
            />
            <button onClick={applyPromo}>Apply</button>
          </div>

          <hr />

          <div className="small">Subtotal: <b>{money(calc.subtotal)}</b></div>
          <div className="small">Tax (5%): <b>{money(calc.tax)}</b></div>
          <div className="small">Discount: <b>-{money(calc.discount)}</b></div>
          <div style={{ marginTop: 10, fontSize: 18 }}>
            Total: <b>{money(calc.total)}</b>
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <button className="danger" onClick={clear}>Clear</button>
          </div>

          {/* <p className="small" style={{ marginTop: 10 }}>
            Logika: cart state, quantity, promo (SAVE10), subtotal/tax/discount/total hisoblash.
          </p> */}
        </div>
      </div>
    </div>
  );
}
