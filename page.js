"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Search, Heart, ShoppingBag,
  Menu, X, Star, Plus, Minus, SlidersHorizontal, Clock3
} from "lucide-react";

const products = [
  { id: 1, name: "Éclipse Noire", category: "Men", type: "Automatic", price: 4890, rating: "4.9", tag: "BESTSELLER", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=90", tone: "dark" },
  { id: 2, name: "Luna Première", category: "Women", type: "Quartz", price: 3250, rating: "4.8", tag: "NEW ARRIVAL", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=90", tone: "light" },
  { id: 3, name: "Chronographe 08", category: "Men", type: "Chronograph", price: 5620, rating: "5.0", tag: "LIMITED", image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=900&q=90", tone: "dark" },
  { id: 4, name: "Petite Élise", category: "Women", type: "Automatic", price: 3980, rating: "4.9", tag: "SIGNATURE", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=90", tone: "light" },
];

const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function Header({ cartCount, wishlistCount, onCart, onWishlist }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  if (typeof window !== "undefined" && !window.__mtScrollBound) {
    window.__mtScrollBound = true;
    window.addEventListener("scroll", () => {
      document.documentElement.dataset.scrolled = window.scrollY > 30 ? "true" : "false";
    }, { passive: true });
  }
  const links = [["Home", "#home"], ["Collection", "#collection"], ["Men", "#collection"], ["Women", "#collection"], ["Our Story", "#story"], ["Contact", "#footer"]];
  return (
    <header className="site-header">
      <div className="nav-inner">
        <a className="brand" href="#home" aria-label="Maison Temps home">
          <span className="brand-mark"><Clock3 size={21} strokeWidth={1.3}/></span>
          <span>MAISON <b>TEMPS</b><small>ATELIER HORLOGER</small></span>
        </a>
        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`} aria-label="Main navigation">
          {links.map(([label, href], i) => <a key={label} className={i === 0 ? "active" : ""} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <button className="icon-button search-toggle" aria-label="Search" onClick={() => document.getElementById("watch-search")?.focus()}><Search size={19}/></button>
          <button className="icon-button" aria-label={`Wishlist, ${wishlistCount} items`} onClick={onWishlist}><Heart size={19}/><i>{wishlistCount}</i></button>
          <button className="icon-button bag-button" aria-label={`Shopping bag, ${cartCount} items`} onClick={onCart}><ShoppingBag size={19}/><i>{cartCount}</i></button>
          <button className="icon-button mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
      </div>
    </header>
  );
}

function ProductCard({ product, onAdd, onQuickView, wished, onWish }) {
  const reduce = useReducedMotion();
  return (
    <motion.article className="product-card" whileHover={reduce ? undefined : { y: -8 }} transition={{ duration: .35, ease: [.2,.8,.2,1] }}>
      <div className="product-image-wrap">
        <img src={product.image} alt={`${product.name} luxury watch`} className="product-image" loading="lazy"/>
        <span className="product-tag">{product.tag}</span>
        <button className={`wish-button ${wished ? "is-wished" : ""}`} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} onClick={() => onWish(product.id)}><Heart size={18} fill={wished ? "currentColor" : "none"}/></button>
        <button className="quick-view" onClick={() => onQuickView(product)}>QUICK VIEW <ArrowUpRight size={15}/></button>
      </div>
      <div className="product-info">
        <div><span className="product-category">{product.category.toUpperCase()} · {product.type.toUpperCase()}</span><h3>{product.name}</h3></div>
        <div className="product-price">{money(product.price)}</div>
      </div>
      <div className="product-bottom"><span className="rating"><Star size={13} fill="currentColor"/> {product.rating} <span>(32)</span></span><button onClick={() => onAdd(product)} className="add-link">ADD TO BAG <Plus size={14}/></button></div>
    </motion.article>
  );
}

function Modal({ product, onClose, onAdd }) {
  if (!product) return null;
  return (
    <AnimatePresence>
      <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
        <motion.div className="quick-modal" role="dialog" aria-modal="true" aria-label={`${product.name} details`} initial={{ opacity: 0, y: 25, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} onMouseDown={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close"><X/></button>
          <img src={product.image} alt={product.name}/>
          <div className="modal-copy"><span className="eyebrow">THE MAISON COLLECTION</span><h2>{product.name}</h2><p className="modal-price">{money(product.price)}</p><p className="modal-description">A considered expression of timeless design. Crafted with precision, finished by hand, and made to accompany every defining moment.</p><div className="modal-meta"><span>Movement</span><b>{product.type}</b><span>Collection</span><b>{product.category}</b></div><button className="button button-gold modal-add" onClick={() => { onAdd(product); onClose(); }}>ADD TO BAG <ArrowRight size={16}/></button></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [panel, setPanel] = useState("");
  const reduce = useReducedMotion();
  const visibleProducts = useMemo(() => products.filter(p => (filter === "All" || p.category === filter) && p.name.toLowerCase().includes(search.toLowerCase())), [filter, search]);
  const cartCount = cart.reduce((n, item) => n + item.qty, 0);
  const addToCart = (product) => {
    setCart(old => old.some(x => x.id === product.id) ? old.map(x => x.id === product.id ? {...x, qty: x.qty + 1} : x) : [...old, {...product, qty: 1}]);
    setNotice(`${product.name} added to your bag`);
    window.setTimeout(() => setNotice(""), 2600);
  };
  const toggleWish = (id) => setWishlist(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const updateQty = (id, amount) => setCart(old => old.map(x => x.id === id ? {...x, qty: x.qty + amount} : x).filter(x => x.qty > 0));
  const reveal = reduce ? {} : { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: .7, ease: [.2,.8,.2,1] } } };

  return (
    <main>
      <Header cartCount={cartCount} wishlistCount={wishlist.length} onCart={() => setPanel("cart")} onWishlist={() => setPanel("wishlist")}/>
      <section className="hero" id="home">
        <div className="hero-glow"/>
        <div className="hero-content">
          <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="hero-kicker"><span/> THE ART OF TIMEKEEPING <span/></motion.div>
          <motion.h1 initial={reduce ? false : { opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .95, delay: .12 }}>TIME IS YOUR<br/><em>SIGNATURE.</em></motion.h1>
          <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55, duration: .8 }}>A study in precision. An expression of you.<br/>Discover timepieces made to outlast the moment.</motion.p>
          <motion.a initial={reduce ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7 }} href="#collection" className="button button-gold">EXPLORE THE COLLECTION <ArrowUpRight size={16}/></motion.a>
        </div>
        <div className="hero-image" role="img" aria-label="Close-up of a refined luxury wristwatch"/>
        <div className="hero-index"><span>01</span> / 04</div>
        <a className="scroll-cue" href="#collection"><span>SCROLL TO DISCOVER</span><ArrowDown size={15}/></a>
        <div className="hero-side-note">CRAFTED FOR THE EXCEPTIONAL</div>
      </section>

      <section className="intro-strip">
        <span>DESIGNED WITH INTENTION</span><div className="intro-line"/><p>Not simply worn. <em>Remembered.</em></p><div className="intro-line"/><span>EST. MMXIV</span>
      </section>

      <section className="collection section-pad" id="collection">
        <motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
          <div><span className="eyebrow">A CURATED SELECTION</span><h2>Time, <em>reimagined.</em></h2></div>
          <p>Distinctive forms. Impeccable mechanics.<br/>Find the piece that speaks your language.</p>
        </motion.div>
        <div className="collection-toolbar">
          <div className="filter-tabs" aria-label="Filter watches">
            {["All", "Men", "Women"].map(x => <button key={x} className={filter === x ? "selected" : ""} onClick={() => setFilter(x)}>{x === "All" ? "ALL PIECES" : `${x.toUpperCase()}’S`}</button>)}
          </div>
          <label className="search-field"><Search size={16}/><input id="watch-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Find your timepiece" aria-label="Search watches"/></label>
        </div>
        <div className="product-grid">
          {visibleProducts.map((p, i) => <motion.div key={p.id} initial={reduce ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .55, delay: i * .08 }}><ProductCard product={p} onAdd={addToCart} onQuickView={setQuickView} wished={wishlist.includes(p.id)} onWish={toggleWish}/></motion.div>)}
        </div>
        {visibleProducts.length === 0 && <p className="empty-state">No timepieces found. Try another search.</p>}
        <div className="center-action"><a href="#story" className="text-link">DISCOVER OUR PHILOSOPHY <ArrowRight size={16}/></a></div>
      </section>

      <section className="craft-section" id="story">
        <div className="craft-image"/>
        <div className="craft-copy"><span className="eyebrow">THE MAISON PHILOSOPHY</span><h2>Made for moments<br/>that <em>matter.</em></h2><p>We believe a watch is more than an instrument. It is a quiet statement of character, a keeper of milestones, and a companion through every chapter.</p><a href="#footer" className="text-link">OUR STORY <ArrowUpRight size={16}/></a><div className="craft-number">01 <span>—</span> 03</div></div>
      </section>

      <section className="stats-section">
        <div className="stat"><strong>120<span>+</span></strong><small>HOURS OF HAND FINISHING</small></div>
        <div className="stat"><strong>10<span>YR</span></strong><small>MAISON CRAFT LEGACY</small></div>
        <div className="stat"><strong>05</strong><small>YEAR INTERNATIONAL WARRANTY</small></div>
      </section>

      <section className="newsletter">
        <span className="eyebrow">A NOTE FROM THE MAISON</span><h2>Time well <em>spent.</em></h2><p>Be the first to discover new releases, private previews and stories from our atelier.</p>
        <form onSubmit={e => { e.preventDefault(); setNotice("Thank you for joining the Maison list."); e.target.reset(); window.setTimeout(() => setNotice(""), 3000); }}><input type="email" required placeholder="Your email address" aria-label="Your email address"/><button aria-label="Subscribe"><ArrowRight/></button></form>
      </section>

      <footer id="footer"><div className="footer-top"><a className="brand footer-brand" href="#home"><span className="brand-mark"><Clock3 size={21}/></span><span>MAISON <b>TEMPS</b><small>ATELIER HORLOGER</small></span></a><p>TIME IS YOUR SIGNATURE.</p><a className="back-top" href="#home">BACK TO TOP ↑</a></div><div className="footer-bottom"><span>© 2026 MAISON TEMPS. ALL RIGHTS RESERVED.</span><span>CRAFTED WITH INTENTION.</span><div><a href="#footer">INSTAGRAM</a><a href="#footer">CONTACT</a></div></div></footer>

      <Modal product={quickView} onClose={() => setQuickView(null)} onAdd={addToCart}/>
      <AnimatePresence>
        {panel && <motion.div className="drawer-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setPanel("")}><motion.aside className="drawer" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"tween",duration:.3}} onClick={e => e.stopPropagation()}><div className="drawer-head"><h2>{panel === "cart" ? "Your bag" : "Your wishlist"}</h2><button className="icon-button" onClick={() => setPanel("")} aria-label="Close panel"><X/></button></div>
          {panel === "cart" ? <>{cart.length ? <>{cart.map(item => <div className="drawer-item" key={item.id}><img src={item.image} alt=""/><div><b>{item.name}</b><span>{money(item.price)}</span><div className="qty"><button onClick={() => updateQty(item.id,-1)} aria-label="Decrease quantity"><Minus size={13}/></button>{item.qty}<button onClick={() => updateQty(item.id,1)} aria-label="Increase quantity"><Plus size={13}/></button></div></div></div>)}<div className="drawer-total"><span>SUBTOTAL</span><b>{money(cart.reduce((n,x)=>n+x.price*x.qty,0))}</b></div><button className="button button-gold checkout" onClick={() => setNotice("Checkout demo — connect a payment provider to accept orders.")}>CONTINUE TO CHECKOUT <ArrowRight size={16}/></button></> : <p className="drawer-empty">Your bag is waiting for something timeless.</p>}</> : <>{wishlist.length ? wishlist.map(id => {const p=products.find(x=>x.id===id);return <div className="drawer-item" key={id}><img src={p.image} alt=""/><div><b>{p.name}</b><span>{money(p.price)}</span><button className="add-link" onClick={() => addToCart(p)}>ADD TO BAG +</button></div></div>}) : <p className="drawer-empty">Save the pieces you love and find them here.</p>}</>}
        </motion.aside></motion.div>}
      </AnimatePresence>
      <AnimatePresence>{notice && <motion.div className="toast" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}>{notice}</motion.div>}</AnimatePresence>
    </main>
  );
}