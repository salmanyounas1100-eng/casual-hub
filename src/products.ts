// ✏️ EDIT THIS FILE: your products and prices (placeholders for now).
// To show a photo, copy it into public/products/ and set image: 'products/photo-name.jpg'.
export type Product = {
  id: string
  name: string
  audience: 'Men' | 'Kids'
  type: 'Pants' | 'Shirts' | 'Trousers'
  price: number
  sizes: string[]
  color: string // tile colour shown when there is no photo
  image?: string
}

const waist = ['28', '30', '32', '34', '36', '38']
const top = ['S', 'M', 'L', 'XL']
const kids = ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y']

export const PRODUCTS: Product[] = [
  { id: 'm1', name: 'Slim Fit Jeans Pant', audience: 'Men', type: 'Pants', price: 2800, sizes: waist, color: '#334e68' },
  { id: 'm2', name: 'Cotton Chino Pant', audience: 'Men', type: 'Pants', price: 2500, sizes: waist, color: '#a68a64' },
  { id: 'm3', name: 'Formal Dress Trouser', audience: 'Men', type: 'Trousers', price: 3200, sizes: waist, color: '#2b2d42' },
  { id: 'm4', name: 'Casual Trouser', audience: 'Men', type: 'Trousers', price: 2200, sizes: waist, color: '#6b705c' },
  { id: 'm5', name: 'Casual Cotton Shirt', audience: 'Men', type: 'Shirts', price: 2400, sizes: top, color: '#8ecae6' },
  { id: 'm6', name: 'Printed Half-Sleeve Shirt', audience: 'Men', type: 'Shirts', price: 1900, sizes: top, color: '#e76f51' },
  { id: 'k1', name: 'Kids Denim Pant', audience: 'Kids', type: 'Pants', price: 1800, sizes: kids, color: '#457b9d' },
  { id: 'k2', name: 'Kids Cotton Trouser', audience: 'Kids', type: 'Trousers', price: 1500, sizes: kids, color: '#b5838d' },
  { id: 'k3', name: 'Kids Check Shirt', audience: 'Kids', type: 'Shirts', price: 1400, sizes: kids, color: '#e9c46a' },
  { id: 'k4', name: 'Kids Plain Shirt', audience: 'Kids', type: 'Shirts', price: 1200, sizes: kids, color: '#90be6d' },
]
