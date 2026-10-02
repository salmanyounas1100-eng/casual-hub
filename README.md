# Casual Hub

Online shop for Casual Hub (men's and kids' pants, shirts, trousers), Gajju Matta, near Metro Bus Station, Lahore.
Customers browse, choose a size, add to cart, and send the order to the shop on WhatsApp. No backend or payment system.

## 1. Edit your details (important)
- `src/config.ts`: WhatsApp number (**must change**), phone, opening hours, address.
- `src/products.ts`: products, prices, sizes. To use a photo, put it in `public/products/` and set `image: 'products/name.jpg'`.

## 2. Run locally
```bash
npm install
npm run dev
```

## 3. Put it online (free) with GitHub Pages
1. Create a GitHub repo and push this folder to the `main` branch.
2. Run `npm install` once and commit the generated `package-lock.json`.
3. Repo **Settings → Pages → Source: GitHub Actions**. Every push to `main` redeploys the site.
