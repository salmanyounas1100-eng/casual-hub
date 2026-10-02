import { useEffect, useMemo, useState } from 'react'
import { SHOP } from './config'
import { PRODUCTS } from './products'
import type { Product } from './products'

type Line = { id: string; size: string; qty: number }
const money = (n: number) => `${SHOP.currency} ${n.toLocaleString('en-PK')}`
const CART_KEY = 'casual-hub-cart'

function loadCart(): Line[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] }
}

function Tile({ p }: { p: Product }) {
  return p.image ? (
    <img className="tile" src={`${import.meta.env.BASE_URL}${p.image}`} alt={p.name} loading="lazy" />
  ) : (
    <div className="tile tile--color" style={{ background: p.color }} aria-hidden="true">{p.audience}</div>
  )
}

function Card({ p, onAdd }: { p: Product; onAdd: (id: string, size: string) => void }) {
  const [size, setSize] = useState('')
  const [warn, setWarn] = useState(false)
  const [added, setAdded] = useState(false)
  const add = () => {
    if (!size) return setWarn(true)
    onAdd(p.id, size)
    setWarn(false); setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }
  return (
    <article className="card">
      <Tile p={p} />
      <div className="card__body">
        <p className="card__meta">{p.audience} · {p.type}</p>
        <h3>{p.name}</h3>
        <p className="card__price">{money(p.price)}</p>
        <select value={size} onChange={(e) => { setSize(e.target.value); setWarn(false) }} aria-label={`Size for ${p.name}`} aria-invalid={warn}>
          <option value="">Select size</option>
          {p.sizes.map((s) => <option key={s}>{s}</option>)}
        </select>
        {warn && <p className="err" role="alert">Please choose a size.</p>}
        <button className="btn btn--dark" type="button" onClick={add}>{added ? 'Added ✓' : 'Add to cart'}</button>
      </div>
    </article>
  )
}

export default function App() {
  const [cart, setCart] = useState<Line[]>(loadCart)
  const [open, setOpen] = useState(false)
  const [aud, setAud] = useState('All')
  const [type, setType] = useState('All')
  const [f, setF] = useState({ name: '', phone: '', address: '' })
  const [err, setErr] = useState<Record<string, string>>({})

  useEffect(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)) } catch { /* private mode */ } }, [cart])
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  const shown = useMemo(() => PRODUCTS.filter((p) => (aud === 'All' || p.audience === aud) && (type === 'All' || p.type === type)), [aud, type])
  const items = cart.map((l) => ({ ...l, p: PRODUCTS.find((x) => x.id === l.id)! })).filter((l) => l.p)
  const count = items.reduce((n, l) => n + l.qty, 0)
  const total = items.reduce((n, l) => n + l.qty * l.p.price, 0)

  const add = (id: string, size: string) =>
    setCart((c) => c.some((l) => l.id === id && l.size === size) ? c.map((l) => (l.id === id && l.size === size ? { ...l, qty: l.qty + 1 } : l)) : [...c, { id, size, qty: 1 }])
  const bump = (id: string, size: string, d: number) =>
    setCart((c) => c.map((l) => (l.id === id && l.size === size ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0))

  const order = () => {
    const next: Record<string, string> = {}
    if (!f.name.trim()) next.name = 'Please enter your name.'
    if (!/^(\+92|0)?3\d{9}$/.test(f.phone.replace(/[\s-]/g, ''))) next.phone = 'Enter a valid mobile number, e.g. 0300 1234567.'
    if (f.address.trim().length < 8) next.address = 'Please enter your full delivery address.'
    setErr(next)
    if (Object.keys(next).length) return
    const lines = items.map((l, i) => `${i + 1}. ${l.p.name} (Size ${l.size}) × ${l.qty} = ${money(l.p.price * l.qty)}`).join('\n')
    const msg = `*New order, ${SHOP.name}*\n\n${lines}\n\n*Total: ${money(total)}*\n\nName: ${f.name}\nPhone: ${f.phone}\nAddress: ${f.address}`
    window.open(`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
  }

  const chips = (opts: string[], val: string, set: (v: string) => void, label: string) => (
    <div className="chips" role="group" aria-label={label}>
      {opts.map((o) => <button key={o} type="button" aria-pressed={val === o} onClick={() => set(o)}>{o}</button>)}
    </div>
  )

  return (
    <>
      <header className="top">
        <a className="logo" href="#top">Casual<span>Hub</span></a>
        <nav aria-label="Primary">
          <a href="#shop">Shop</a>
          <a href="#visit">Visit us</a>
        </nav>
        <button className="cartbtn" type="button" onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`}>
          Cart <span className="badge">{count}</span>
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">Gajju Matta, Lahore</p>
          <h1>Everyday style for men &amp; kids</h1>
          <p>Pants, shirts and trousers at {SHOP.name}. Choose your size, add to cart and send your order on WhatsApp.</p>
          <div className="hero__cta">
            <a className="btn btn--accent" href="#shop">Shop now</a>
            <a className="btn btn--ghost" href="#visit">Visit our shop</a>
          </div>
        </section>

        <section id="shop" className="sec">
          <h2>Shop</h2>
          {chips(['All', 'Men', 'Kids'], aud, setAud, 'Filter by who it is for')}
          {chips(['All', 'Pants', 'Shirts', 'Trousers'], type, setType, 'Filter by type')}
          {shown.length ? (
            <div className="grid">{shown.map((p) => <Card key={p.id} p={p} onAdd={add} />)}</div>
          ) : <p className="empty">Nothing matches these filters yet.</p>}
        </section>

        <section id="visit" className="sec visit">
          <div>
            <h2>Visit our shop</h2>
            <p className="addr">{SHOP.address}</p>
            <p>{SHOP.hours}</p>
          </div>
          <div className="visit__btns">
            <a className="btn btn--dark" href={SHOP.mapsUrl} target="_blank" rel="noopener noreferrer">Get directions</a>
            <a className="btn btn--ghost-d" href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            <a className="btn btn--ghost-d" href={`tel:+${SHOP.whatsapp}`}>Call {SHOP.phoneDisplay}</a>
          </div>
        </section>
      </main>

      <footer className="foot">© {new Date().getFullYear()} {SHOP.name} · {SHOP.address}</footer>

      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <aside className={`drawer ${open ? 'drawer--open' : ''}`} role="dialog" aria-modal="true" aria-label="Your cart" aria-hidden={!open}>
        <div className="drawer__head">
          <h2>Your cart</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close cart">✕</button>
        </div>
        {items.length === 0 ? <p className="empty">Your cart is empty.</p> : (
          <>
            <ul className="lines">
              {items.map((l) => (
                <li key={l.id + l.size}>
                  <div><strong>{l.p.name}</strong><small>Size {l.size} · {money(l.p.price)}</small></div>
                  <span className="step">
                    <button type="button" aria-label="Remove one" onClick={() => bump(l.id, l.size, -1)}>−</button>
                    <output>{l.qty}</output>
                    <button type="button" aria-label="Add one" onClick={() => bump(l.id, l.size, 1)}>+</button>
                  </span>
                </li>
              ))}
            </ul>
            <p className="total"><span>Total</span><span>{money(total)}</span></p>
            <div className="form">
              {([['name', 'Your name', 'text'], ['phone', 'Mobile number', 'tel'], ['address', 'Delivery address', 'text']] as const).map(([k, l, t]) => (
                <label key={k}>{l}
                  <input type={t} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} />
                  {err[k] && <span className="err" role="alert">{err[k]}</span>}
                </label>
              ))}
              <button className="btn btn--wa" type="button" onClick={order}>Order on WhatsApp</button>
              <p className="note">{SHOP.orderNote}</p>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
