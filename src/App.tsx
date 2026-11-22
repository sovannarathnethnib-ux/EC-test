import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { createOrder, getCategories, getProducts } from './api'
import './App.css'

type Language = 'en' | 'km'
type Theme = 'light' | 'dark'

const translations = {
  en: {
    home: 'BrandY home',
    cart: 'Cart',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    dark: 'Dark',
    light: 'Light',
    language: 'Language',
    orderProgress: 'Order progress',
    shop: 'Shop',
    checkout: 'Checkout',
    confirmation: 'Confirmation',
    pageShop: 'Make room for good work.',
    pageCart: 'Your selection.',
    pageCheckout: 'Your details.',
    pageConfirmation: 'All set.',
    introShop: 'Considered essentials for wherever your ideas take you.',
    introCart: 'Take a final look before making it yours.',
    introCheckout: 'A few details and these good things are on their way.',
    introConfirmation: 'Your order is in good hands.',
    collection: 'THE COLLECTION',
    deskEssentials: 'Desk essentials',
    selectedPieces: 'carefully chosen pieces',
    yourBag: 'YOUR BAG',
    shoppingCart: 'Shopping cart',
    addToCart: 'Add to Cart',
    shopFootnote: 'Considered essentials for a more thoughtful workday',
    emptyCartTitle: 'Your cart is waiting for something good.',
    emptyCartHint: 'Add a desk essential to get started.',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    calculatedAtCheckout: 'Calculated at checkout',
    grandTotal: 'Grand total',
    viewCart: 'View Cart',
    secureCheckout: 'Secure checkout',
    easyReturns: 'Easy returns',
    item: 'item',
    items: 'items',
    continueShopping: '← Continue shopping',
    emptyCartPage: 'Your cart is looking a little light.',
    exploreCollection: 'Explore the collection',
    orderSummary: 'ORDER SUMMARY',
    atAGlance: 'At a glance',
    shippingHint: 'Shipping options are available at checkout.',
    proceedToCheckout: 'Proceed to Checkout',
    deliveryPrompt: 'Where should we send it?',
    contactDelivery: 'Contact & delivery',
    privateDetails: 'Your details stay private and secure.',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    phone: 'Phone number',
    address: 'Street address',
    shippingMethod: 'Shipping method',
    chooseShipping: 'Choose what works best for you.',
    standardShipping: 'Standard shipping',
    standardDetail: '3–5 business days',
    expressShipping: 'Express shipping',
    expressDetail: '1–2 business days',
    storePickup: 'Store pickup',
    pickupDetail: 'Ready in 2 hours',
    free: 'Free',
    yourSelection: 'Your selection',
    placeOrder: 'Place Order',
    backToCart: '← Back to cart',
    orderPlaced: 'Order Placed Successfully!',
    thanks: 'Thanks',
    orderReceived: 'We’ve received your order and will send updates to',
    orderDate: 'Order date',
    orderStatus: 'Order status',
    pending: 'Pending',
    orderLabel: 'ORDER',
    shipTo: 'Ship to',
    backToCollection: '← Back to the collection',
    orderDetails: 'ORDER DETAILS',
    totalAmount: 'Total amount',
    orderId: 'Order ID',
    footerTagline: 'Good tools. Better days.',
    laptop: 'Laptop',
    mouse: 'Mouse',
    keyboard: 'Keyboard',
    monitor: 'Monitor',
    computers: 'Computers',
    accessories: 'Accessories',
    displays: 'Displays',
    laptopDescription: 'A powerful everyday companion.',
    mouseDescription: 'Smooth, precise wireless control.',
    keyboardDescription: 'A comfortable, satisfying type.',
    monitorDescription: 'More room for your best ideas.',
    quantity: 'quantity',
    decrease: 'Decrease',
    increase: 'Increase',
    remove: 'Remove',
    qty: 'Qty',
    loadingCatalog: 'Loading products…',
    catalogError: 'The catalog could not be loaded.',
    apiServerHint: 'Start the Laravel API and MySQL database, then refresh.',
    placingOrder: 'Placing order…',
    placeOrderError: 'Your order could not be saved.',
  },
  km: {
    home: 'ទំព័រដើម BrandY',
    cart: 'រទេះទិញទំនិញ',
    darkMode: 'ប្តូរទៅរបៀបងងឹត',
    lightMode: 'ប្តូរទៅរបៀបភ្លឺ',
    dark: 'ងងឹត',
    light: 'ភ្លឺ',
    language: 'ភាសា',
    orderProgress: 'ដំណើរការបញ្ជាទិញ',
    shop: 'ទិញទំនិញ',
    checkout: 'ទូទាត់',
    confirmation: 'ការបញ្ជាក់',
    pageShop: 'រៀបចំកន្លែងសម្រាប់ការងារល្អ',
    pageCart: 'ជម្រើសរបស់អ្នក',
    pageCheckout: 'ព័ត៌មានរបស់អ្នក',
    pageConfirmation: 'រួចរាល់ហើយ',
    introShop: 'សម្ភារៈប្រើប្រាស់ដែលបានជ្រើសរើស សម្រាប់គំនិតថ្មីៗរបស់អ្នក',
    introCart: 'ពិនិត្យមើលម្តងទៀត មុនពេលបន្តការបញ្ជាទិញ',
    introCheckout: 'បំពេញព័ត៌មានខ្លីៗ ដើម្បីទទួលបានទំនិញរបស់អ្នក',
    introConfirmation: 'ការបញ្ជាទិញរបស់អ្នកកំពុងដំណើរការ',
    collection: 'ផលិតផលជ្រើសរើស',
    deskEssentials: 'សម្ភារៈសម្រាប់តុធ្វើការ',
    selectedPieces: 'មុខដែលបានជ្រើសរើស',
    yourBag: 'រទេះរបស់អ្នក',
    shoppingCart: 'រទេះទិញទំនិញ',
    addToCart: 'បន្ថែមទៅរទេះ',
    shopFootnote: 'សម្ភារៈប្រើប្រាស់សម្រាប់ថ្ងៃធ្វើការកាន់តែប្រសើរ',
    emptyCartTitle: 'រទេះរបស់អ្នកទទេនៅឡើយ',
    emptyCartHint: 'បន្ថែមសម្ភារៈមួយ ដើម្បីចាប់ផ្តើម',
    subtotal: 'សរុបរង',
    shipping: 'ការដឹកជញ្ជូន',
    calculatedAtCheckout: 'គណនានៅពេលទូទាត់',
    grandTotal: 'សរុបចុងក្រោយ',
    viewCart: 'មើលរទេះ',
    secureCheckout: 'ការទូទាត់មានសុវត្ថិភាព',
    easyReturns: 'ងាយស្រួលប្រគល់ត្រឡប់',
    item: 'មុខ',
    items: 'មុខ',
    continueShopping: '← បន្តទិញទំនិញ',
    emptyCartPage: 'រទេះរបស់អ្នកមិនទាន់មានទំនិញទេ',
    exploreCollection: 'មើលផលិតផល',
    orderSummary: 'សេចក្តីសង្ខេបការបញ្ជាទិញ',
    atAGlance: 'សង្ខេប',
    shippingHint: 'ជ្រើសរើសវិធីដឹកជញ្ជូននៅពេលទូទាត់',
    proceedToCheckout: 'បន្តទៅការទូទាត់',
    deliveryPrompt: 'តើអ្នកចង់ឱ្យដឹកជញ្ជូនទៅកន្លែងណា?',
    contactDelivery: 'ព័ត៌មានទំនាក់ទំនង និងដឹកជញ្ជូន',
    privateDetails: 'ព័ត៌មានរបស់អ្នកត្រូវបានរក្សាទុកដោយសុវត្ថិភាព',
    firstName: 'នាមខ្លួន',
    lastName: 'នាមត្រកូល',
    email: 'អ៊ីមែល',
    phone: 'លេខទូរស័ព្ទ',
    address: 'អាសយដ្ឋាន',
    shippingMethod: 'វិធីដឹកជញ្ជូន',
    chooseShipping: 'ជ្រើសរើសវិធីដែលសមស្របសម្រាប់អ្នក',
    standardShipping: 'ដឹកជញ្ជូនធម្មតា',
    standardDetail: '៣–៥ ថ្ងៃធ្វើការ',
    expressShipping: 'ដឹកជញ្ជូនរហ័ស',
    expressDetail: '១–២ ថ្ងៃធ្វើការ',
    storePickup: 'មកយកនៅហាង',
    pickupDetail: 'រួចរាល់ក្នុងរយៈពេល ២ ម៉ោង',
    free: 'ឥតគិតថ្លៃ',
    yourSelection: 'ទំនិញដែលអ្នកបានជ្រើសរើស',
    placeOrder: 'បញ្ជាទិញ',
    backToCart: '← ត្រឡប់ទៅរទេះ',
    orderPlaced: 'ការបញ្ជាទិញបានជោគជ័យ!',
    thanks: 'អរគុណ',
    orderReceived: 'យើងបានទទួលការបញ្ជាទិញ ហើយនឹងផ្ញើព័ត៌មានថ្មីៗទៅ',
    orderDate: 'កាលបរិច្ឆេទបញ្ជាទិញ',
    orderStatus: 'ស្ថានភាពការបញ្ជាទិញ',
    pending: 'កំពុងរង់ចាំ',
    orderLabel: 'ការបញ្ជាទិញ',
    shipTo: 'ដឹកជញ្ជូនទៅ',
    backToCollection: '← ត្រឡប់ទៅផលិតផល',
    orderDetails: 'ព័ត៌មានការបញ្ជាទិញ',
    totalAmount: 'ចំនួនសរុប',
    orderId: 'លេខសម្គាល់ការបញ្ជាទិញ',
    footerTagline: 'ឧបករណ៍ល្អ ថ្ងៃកាន់តែប្រសើរ',
    laptop: 'កុំព្យូទ័រយួរដៃ',
    mouse: 'កណ្ដុរ',
    keyboard: 'ក្ដារចុច',
    monitor: 'ម៉ូនីទ័រ',
    computers: 'កុំព្យូទ័រ',
    accessories: 'គ្រឿងបន្ថែម',
    displays: 'អេក្រង់',
    laptopDescription: 'ដៃគូដ៏មានថាមពលសម្រាប់រាល់ថ្ងៃ',
    mouseDescription: 'ការគ្រប់គ្រងឥតខ្សែរលូន និងត្រឹមត្រូវ',
    keyboardDescription: 'វាយអក្សរបានងាយស្រួល និងរលូន',
    monitorDescription: 'កន្លែងធំទូលាយសម្រាប់គំនិតល្អៗ',
    quantity: 'ចំនួន',
    decrease: 'បន្ថយ',
    increase: 'បង្កើន',
    remove: 'លុបចេញ',
    qty: 'ចំនួន',
    loadingCatalog: 'កំពុងផ្ទុកផលិតផល…',
    catalogError: 'មិនអាចផ្ទុកបញ្ជីផលិតផលបានទេ។',
    apiServerHint: 'សូមចាប់ផ្តើម Laravel API និង MySQL រួចផ្ទុកទំព័រឡើងវិញ។',
    placingOrder: 'កំពុងបញ្ជាទិញ…',
    placeOrderError: 'មិនអាចរក្សាទុកការបញ្ជាទិញបានទេ។',
  },
} as const

type Copy = { [Key in keyof typeof translations.en]: string }

type Product = {
  id: number
  name: string
  category: string
  description: keyof Copy
  price: number
  tone: string
  art: ReactNode
}

type CartLine = { product: Product; quantity: number }
type View = 'shop' | 'cart' | 'checkout' | 'confirmation'
type Customer = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
}
type CompletedOrder = {
  id: string
  customer: Customer
  date: { year: number; month: number; day: number }
  items: CartLine[]
  total: number
  shipping: number
}

const productPresentation: Record<string, { nameKey: keyof Copy; description: keyof Copy; tone: string; art: ReactNode }> = {
  Laptop: {
    nameKey: 'laptop',
    description: 'laptopDescription',
    tone: 'lavender',
    art: (
      <svg viewBox="0 0 180 130" aria-hidden="true">
        <rect x="36" y="24" width="108" height="72" rx="7" />
        <rect className="art-screen" x="43" y="31" width="94" height="58" rx="3" />
        <circle className="art-ui" cx="57" cy="44" r="5" />
        <rect className="art-ui" x="69" y="40" width="54" height="4" rx="2" />
        <rect className="art-ui" x="69" y="49" width="43" height="3" rx="1.5" />
        <rect className="art-accent" x="53" y="59" width="30" height="20" rx="3" />
        <rect className="art-ui" x="90" y="61" width="35" height="3" rx="1.5" />
        <rect className="art-ui" x="90" y="69" width="26" height="3" rx="1.5" />
        <path d="M25 101h130l-10 9H35z" />
        <path className="art-detail" d="M78 101h24" />
      </svg>
    ),
  },
  Mouse: {
    nameKey: 'mouse',
    description: 'mouseDescription',
    tone: 'peach',
    art: (
      <svg viewBox="0 0 180 130" aria-hidden="true">
        <path d="M90 24c-25 0-40 17-40 42v14c0 25 15 39 40 39s40-14 40-39V66c0-25-15-42-40-42Z" />
        <path className="art-detail" d="M90 27v33m0 0h0" />
        <rect className="art-screen" x="85" y="43" width="10" height="18" rx="5" />
        <path className="art-highlight" d="M62 65c1-15 9-25 21-29" />
      </svg>
    ),
  },
  Keyboard: {
    nameKey: 'keyboard',
    description: 'keyboardDescription',
    tone: 'mint',
    art: (
      <svg viewBox="0 0 180 130" aria-hidden="true">
        <rect x="23" y="39" width="134" height="64" rx="10" />
        <g className="art-screen">
          <rect x="36" y="52" width="14" height="10" rx="2" /><rect x="56" y="52" width="14" height="10" rx="2" />
          <rect x="76" y="52" width="14" height="10" rx="2" /><rect x="96" y="52" width="14" height="10" rx="2" />
          <rect x="116" y="52" width="14" height="10" rx="2" /><rect x="136" y="52" width="9" height="10" rx="2" />
          <rect x="36" y="68" width="18" height="10" rx="2" /><rect x="60" y="68" width="14" height="10" rx="2" />
          <rect x="80" y="68" width="14" height="10" rx="2" /><rect x="100" y="68" width="14" height="10" rx="2" />
          <rect x="120" y="68" width="25" height="10" rx="2" /><rect x="45" y="84" width="90" height="8" rx="3" />
        </g>
      </svg>
    ),
  },
  Monitor: {
    nameKey: 'monitor',
    description: 'monitorDescription',
    tone: 'blue',
    art: (
      <svg viewBox="0 0 180 130" aria-hidden="true">
        <rect x="27" y="19" width="126" height="78" rx="7" />
        <rect className="art-screen" x="35" y="27" width="110" height="62" rx="3" />
        <rect className="art-accent" x="43" y="35" width="41" height="45" rx="3" />
        <path className="art-highlight" d="M49 69 58 57l7 6 11-16" />
        <rect className="art-ui" x="92" y="38" width="43" height="4" rx="2" />
        <rect className="art-ui" x="92" y="47" width="34" height="3" rx="1.5" />
        <rect className="art-ui" x="92" y="56" width="38" height="3" rx="1.5" />
        <rect className="art-ui" x="92" y="65" width="25" height="3" rx="1.5" />
        <path d="M82 97h16v13H82zM66 110h48v6H66z" />
      </svg>
    ),
  },
}

const categoryTranslationKeys: Record<string, keyof Copy> = {
  Computers: 'computers',
  Accessories: 'accessories',
  Displays: 'displays',
}

function getProductName(name: string, copy: Copy) {
  const key = productPresentation[name]?.nameKey
  return key ? copy[key] : name
}

function getCategoryName(name: string, copy: Copy) {
  const key = categoryTranslationKeys[name]
  return key ? copy[key] : name
}

const shippingOptions = [
  { name: 'standardShipping', detail: 'standardDetail', price: 5, method: 'standard' },
  { name: 'expressShipping', detail: 'expressDetail', price: 15, method: 'express' },
  { name: 'storePickup', detail: 'pickupDetail', price: 0, method: 'pickup' },
] as const

const emptyCustomer: Customer = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
}

const copyrightYear = new Date().getFullYear()
const englishMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']

const money = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

function formatOrderDate(date: CompletedOrder['date'], language: Language) {
  if (language === 'en') return `${englishMonths[date.month]} ${date.day}, ${date.year}`
  const khmerDigits = '០១២៣៤៥៦៧៨៩'
  const toKhmerDigits = (value: number) =>
    String(value).replace(/\d/g, (digit) => khmerDigits[Number(digit)])
  return `${toKhmerDigits(date.day)} ${khmerMonths[date.month]} ${toKhmerDigits(date.year)}`
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')
  const [orderError, setOrderError] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [view, setView] = useState<View>('shop')
  const [cart, setCart] = useState<CartLine[]>([])
  const [customer, setCustomer] = useState<Customer>(emptyCustomer)
  const [shipping, setShipping] = useState(0)
  const [order, setOrder] = useState<CompletedOrder | null>(null)
  const [theme, setTheme] = useState<Theme>('dark')
  const [language, setLanguage] = useState<Language>('en')
  const copy: Copy = translations[language]

  useEffect(() => {
    let active = true

    async function loadCatalog() {
      try {
        const [categories, apiProducts] = await Promise.all([getCategories(), getProducts()])
        if (!active) return

        const categoryNames = new Map(categories.map((category) => [category.category_id, category.name]))
        setProducts(apiProducts.map((product) => {
          const presentation = productPresentation[product.name]
          return {
            id: product.product_id,
            name: product.name,
            category: categoryNames.get(product.category_id) ?? 'Products',
            description: presentation?.description ?? 'shopFootnote',
            price: Number(product.price),
            tone: presentation?.tone ?? 'blue',
            art: presentation?.art ?? <GenericProductArt />,
          }
        }))
        setCatalogError('')
      } catch (error) {
        if (active) setCatalogError(error instanceof Error ? error.message : String(error))
      } finally {
        if (active) setCatalogLoading(false)
      }
    }

    void loadCatalog()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = language
    document.title = `BrandY — ${copy.deskEssentials}`
  }, [theme, language, copy.deskEssentials])

  const subtotal = cart.reduce((total, line) => total + line.product.price * line.quantity, 0)
  const itemCount = cart.reduce((total, line) => total + line.quantity, 0)
  const selectedShipping = shippingOptions[shipping]

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id)
      return existing
        ? current.map((line) =>
            line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
          )
        : [...current, { product, quantity: 1 }]
    })
  }

  function changeQuantity(productId: number, amount: number) {
    setCart((current) =>
      current.map((line) =>
        line.product.id === productId
          ? { ...line, quantity: Math.max(1, line.quantity + amount) }
          : line,
      ),
    )
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return

    setOrderError('')
    setPlacingOrder(true)
    try {
      const result = await createOrder({
        customer: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        },
        shipping_method: selectedShipping.method,
        items: cart.map((line) => ({
          product_id: line.product.id,
          quantity: line.quantity,
        })),
      })
      const now = new Date(result.order_date)
      setOrder({
        id: result.order_number,
        customer,
        date: { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() },
        items: result.items.map((item) => {
          const presentation = productPresentation[item.name]
          return {
            quantity: item.quantity,
            product: {
              id: item.product_id,
              name: item.name,
              category: item.category,
              description: presentation?.description ?? 'shopFootnote',
              price: item.unit_price,
              tone: presentation?.tone ?? 'blue',
              art: presentation?.art ?? <GenericProductArt />,
            },
          }
        }),
        total: result.total_amount,
        shipping,
      })
      setCart([])
      setView('confirmation')
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : String(error))
    } finally {
      setPlacingOrder(false)
    }
  }

  const steps = [copy.shop, copy.checkout, copy.confirmation]
  const activeStep = view === 'shop' || view === 'cart' ? 0 : view === 'checkout' ? 1 : 2
  const pageHeading =
    view === 'confirmation'
      ? copy.pageConfirmation
      : view === 'checkout'
        ? copy.pageCheckout
        : view === 'cart'
          ? copy.pageCart
          : copy.pageShop
  const pageDescription =
    view === 'confirmation'
      ? copy.introConfirmation
      : view === 'checkout'
        ? copy.introCheckout
        : view === 'cart'
          ? copy.introCart
          : copy.introShop

  return (
    <>
      <BackgroundCanvas theme={theme} />
      <div className="app-shell">
      <header className="topbar">
        <a
          className="brand"
          href="#shop"
          onClick={(event) => {
            event.preventDefault()
            setView('shop')
          }}
          aria-label={copy.home}
        >
          <span className="brand-mark">B</span>
          <span className="brand-name">BrandY</span>
        </a>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={theme === 'light' ? copy.darkMode : copy.lightMode}
            title={theme === 'light' ? copy.darkMode : copy.lightMode}
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          >
            <ThemeIcon theme={theme} />
            <span>{theme === 'light' ? copy.dark : copy.light}</span>
          </button>
          <div className="language-toggle" role="group" aria-label={copy.language}>
            <button type="button" className={language === 'en' ? 'selected' : ''} aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
            <button type="button" className={language === 'km' ? 'selected' : ''} aria-pressed={language === 'km'} onClick={() => setLanguage('km')}>ខ្មែរ</button>
          </div>
          <button className="header-cart" type="button" onClick={() => setView('cart')}>
            <CartIcon />
            <span>{copy.cart}</span>
            <span className="cart-count">{itemCount}</span>
          </button>
        </div>
      </header>

      <main>
        <div className="page-intro">
          <div>
            <h1>{pageHeading}</h1>
            <p className="intro-copy">{pageDescription}</p>
          </div>
          <div className="stepper" aria-label={copy.orderProgress}>
            {steps.map((step, index) => (
              <div className={`step ${index <= activeStep ? 'is-active' : ''}`} key={step}>
                <span className="step-number">{index < activeStep ? '✓' : `0${index + 1}`}</span>
                <span>{step}</span>
                {index < steps.length - 1 && <span className={`step-line ${index < activeStep ? 'is-done' : ''}`} />}
              </div>
            ))}
          </div>
        </div>

        {view === 'shop' && (
          <section className="shop-layout" id="shop">
            <div className="product-area">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{copy.collection}</p>
                  <h2>{copy.deskEssentials}</h2>
                </div>
                <span className="muted-copy">{products.length} {copy.selectedPieces}</span>
              </div>
              {catalogLoading ? (
                <p className="api-feedback" role="status">{copy.loadingCatalog}</p>
              ) : catalogError ? (
                <div className="api-feedback" role="alert">
                  <strong>{copy.catalogError}</strong>
                  <span>{catalogError}</span>
                  <small>{copy.apiServerHint}</small>
                </div>
              ) : (
                <div className="product-grid">
                  {products.map((product) => (
                    <article className="product-card" key={product.id}>
                      <div className={`product-art ${product.tone}`}>{product.art}</div>
                      <div className="product-info">
                        <p className="product-category">{getCategoryName(product.category, copy)}</p>
                        <div className="product-name-row">
                          <h3>{getProductName(product.name, copy)}</h3>
                          <span className="product-price">{money(product.price)}</span>
                        </div>
                        <p className="product-description">{copy[product.description]}</p>
                        <button className="add-button" type="button" onClick={() => addToCart(product)}>
                          <span>{copy.addToCart}</span><span className="add-plus">+</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              <div className="shop-footnote"><span>✳</span> {copy.shopFootnote}</div>
            </div>

            <aside className="order-panel">
              <div className="panel-title-row">
                <div><p className="eyebrow">{copy.yourBag}</p><h2>{copy.shoppingCart}</h2></div>
                <span className="panel-count">{itemCount}</span>
              </div>
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <span className="empty-icon"><CartIcon /></span>
                  <p>{copy.emptyCartTitle}</p>
                  <span>{copy.emptyCartHint}</span>
                </div>
              ) : (
                <div className="panel-items">
                  {cart.map((line) => (
                    <CartItem
                      key={line.product.id}
                      line={line}
                      copy={copy}
                      onChange={(amount) => changeQuantity(line.product.id, amount)}
                      onRemove={() => setCart((current) => current.filter((item) => item.product.id !== line.product.id))}
                    />
                  ))}
                </div>
              )}
              <Totals subtotal={subtotal} shipping={0} label={copy.calculatedAtCheckout} copy={copy} />
              <button
                className="primary-button full-button"
                type="button"
                disabled={!cart.length}
                onClick={() => setView('cart')}
              >
                {copy.viewCart} <ArrowRight />
              </button>
              <div className="secure-note"><LockIcon /> {copy.secureCheckout} <span>·</span> {copy.easyReturns}</div>
            </aside>
          </section>
        )}

        {view === 'cart' && (
          <section className="cart-page">
            <div className="cart-main">
              <div className="section-heading">
                <div><p className="eyebrow">{copy.yourBag}</p><h2>{itemCount} {itemCount === 1 ? copy.item : copy.items}</h2></div>
                <button className="text-button" type="button" onClick={() => setView('shop')}>{copy.continueShopping}</button>
              </div>
              {cart.length === 0 ? (
                <div className="cart-empty-page">
                  <p>{copy.emptyCartPage}</p>
                  <button className="primary-button" type="button" onClick={() => setView('shop')}>{copy.exploreCollection} <ArrowRight /></button>
                </div>
              ) : (
                <div className="cart-list">
                  {cart.map((line) => (
                    <CartItem
                      key={line.product.id}
                      line={line}
                      copy={copy}
                      onChange={(amount) => changeQuantity(line.product.id, amount)}
                      onRemove={() => setCart((current) => current.filter((item) => item.product.id !== line.product.id))}
                    />
                  ))}
                </div>
              )}
            </div>
            <aside className="order-panel cart-summary">
              <div className="panel-title-row"><div><p className="eyebrow">{copy.orderSummary}</p><h2>{copy.atAGlance}</h2></div></div>
              <Totals subtotal={subtotal} shipping={0} label={copy.calculatedAtCheckout} copy={copy} />
              <p className="shipping-hint">{copy.shippingHint}</p>
              <button className="primary-button full-button" type="button" disabled={!cart.length} onClick={() => setView('checkout')}>
                {copy.proceedToCheckout} <ArrowRight />
              </button>
              <div className="secure-note"><LockIcon /> {copy.secureCheckout} <span>·</span> {copy.easyReturns}</div>
            </aside>
          </section>
        )}

        {view === 'checkout' && (
          <form className="checkout-layout" onSubmit={placeOrder}>
            <div className="checkout-main">
              <div className="section-heading"><div><p className="eyebrow">{copy.checkout}</p><h2>{copy.deliveryPrompt}</h2></div></div>
              <section className="form-section">
                <div className="form-section-heading"><span className="form-step">01</span><div><h3>{copy.contactDelivery}</h3><p>{copy.privateDetails}</p></div></div>
                <div className="field-grid">
                  <label className="field"><span>{copy.firstName}</span><input autoComplete="given-name" required value={customer.firstName} onChange={(event) => setCustomer({ ...customer, firstName: event.target.value })} placeholder={language === 'km' ? 'សុខា' : 'Alex'} /></label>
                  <label className="field"><span>{copy.lastName}</span><input autoComplete="family-name" required value={customer.lastName} onChange={(event) => setCustomer({ ...customer, lastName: event.target.value })} placeholder={language === 'km' ? 'សុខា' : 'Morgan'} /></label>
                  <label className="field"><span>{copy.email}</span><input autoComplete="email" type="email" required value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} placeholder="alex@example.com" /></label>
                  <label className="field"><span>{copy.phone}</span><input autoComplete="tel" type="tel" required value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="(555) 000-0000" /></label>
                  <label className="field field-wide"><span>{copy.address}</span><input autoComplete="street-address" required value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} placeholder={language === 'km' ? 'ផ្លូវលេខ ១២៣' : '123 Anywhere Street'} /></label>
                </div>
              </section>
              <section className="form-section shipping-section">
                <div className="form-section-heading"><span className="form-step">02</span><div><h3>{copy.shippingMethod}</h3><p>{copy.chooseShipping}</p></div></div>
                <div className="shipping-options">
                  {shippingOptions.map((option, index) => (
                    <label className={`shipping-option ${shipping === index ? 'selected' : ''}`} key={option.name}>
                      <input type="radio" name="shipping" checked={shipping === index} onChange={() => setShipping(index)} />
                      <span className="radio-mark" />
                      <span className="shipping-copy"><strong>{copy[option.name]}</strong><small>{copy[option.detail]}</small></span>
                      <strong className="shipping-price">{option.price === 0 ? copy.free : money(option.price)}</strong>
                    </label>
                  ))}
                </div>
              </section>
              <button className="text-button back-button" type="button" onClick={() => setView('cart')}>{copy.backToCart}</button>
            </div>
            <aside className="order-panel checkout-summary">
              <div className="panel-title-row"><div><p className="eyebrow">{copy.orderSummary}</p><h2>{copy.yourSelection}</h2></div><span className="panel-count">{itemCount}</span></div>
              <div className="summary-items">
                {cart.map((line) => (
                  <div className="summary-item" key={line.product.id}>
                    <span className={`summary-thumb ${line.product.tone}`}>{line.product.art}</span>
                    <div className="summary-name"><strong>{getProductName(line.product.name, copy)}</strong><span>{copy.qty} {line.quantity}</span></div>
                    <span className="summary-line-price">{money(line.product.price * line.quantity)}</span>
                  </div>
                ))}
              </div>
              <Totals subtotal={subtotal} shipping={selectedShipping.price} label={selectedShipping.price ? money(selectedShipping.price) : copy.free} copy={copy} />
              {orderError && (
                <p className="api-feedback" role="alert">{copy.placeOrderError} {orderError}</p>
              )}
              <button className="primary-button full-button" type="submit" disabled={!cart.length || placingOrder}>
                {placingOrder ? copy.placingOrder : copy.placeOrder} <ArrowRight />
              </button>
              <div className="secure-note"><LockIcon /> {copy.secureCheckout} <span>·</span> {copy.easyReturns}</div>
            </aside>
          </form>
        )}

        {view === 'confirmation' && order && (
          <section className="confirmation-layout">
            <div className="confirmation-main">
              <div className="success-mark"><CheckIcon /></div>
              <p className="eyebrow">{copy.orderLabel} {order.id}</p>
              <h2>{copy.orderPlaced}</h2>
              <p className="confirmation-copy">{copy.thanks}, {order.customer.firstName}. {copy.orderReceived} <strong>{order.customer.email}</strong>.</p>
              <div className="confirmation-meta">
                <div><span>{copy.orderDate}</span><strong>{formatOrderDate(order.date, language)}</strong></div>
                <div><span>{copy.orderStatus}</span><strong className="pending-status"><i /> {copy.pending}</strong></div>
                <div><span>{copy.shipping}</span><strong>{copy[shippingOptions[order.shipping].name]}</strong></div>
                <div><span>{copy.shipTo}</span><strong>{order.customer.address}</strong></div>
              </div>
              <button className="text-button back-button" type="button" onClick={() => setView('shop')}>{copy.backToCollection}</button>
            </div>
            <aside className="order-panel confirmation-summary">
              <div className="panel-title-row"><div><p className="eyebrow">{copy.orderDetails}</p><h2>{order.customer.firstName} {order.customer.lastName}</h2></div></div>
              <div className="summary-items">
                {order.items.map((line) => (
                  <div className="summary-item" key={line.product.id}>
                    <span className={`summary-thumb ${line.product.tone}`}>{line.product.art}</span>
                    <div className="summary-name"><strong>{getProductName(line.product.name, copy)}</strong><span>{copy.qty} {line.quantity}</span></div>
                    <span className="summary-line-price">{money(line.product.price * line.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="confirmation-total"><span>{copy.totalAmount}</span><strong>{money(order.total)}</strong></div>
              <div className="order-id-note">{copy.orderId} <strong>{order.id}</strong></div>
            </aside>
          </section>
        )}
      </main>
      <footer className="site-footer"><span>BrandY</span><span>{copy.footerTagline}</span><span>© {copyrightYear}</span></footer>
      </div>
    </>
  )
}

function GenericProductArt() {
  return (
    <svg viewBox="0 0 180 130" aria-hidden="true">
      <rect x="45" y="30" width="90" height="70" rx="14" />
      <circle className="art-accent" cx="90" cy="65" r="18" />
      <path className="art-detail" d="M75 110h30" />
    </svg>
  )
}

type BackgroundParticle = { x: number; y: number; speedX: number; speedY: number }

function BackgroundCanvas({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasElement = canvasRef.current
    if (canvasElement === null) return
    const canvas: HTMLCanvasElement = canvasElement
    const drawingContext = canvas.getContext('2d')
    if (drawingContext === null) return
    const context: CanvasRenderingContext2D = drawingContext
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let frame = 0
    let particles: BackgroundParticle[] = []
    const pointer = { x: -1000, y: -1000, active: false }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.min(100, Math.max(40, Math.round((width * height) / 16000)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        speedX: (Math.random() - 0.5) * 0.16,
        speedY: (Math.random() - 0.5) * 0.16,
      }))
    }

    function draw() {
      context.clearRect(0, 0, width, height)
      particles.forEach((particle) => {
        if (!reducedMotion) {
          particle.x = (particle.x + particle.speedX + width) % width
          particle.y = (particle.y + particle.speedY + height) % height
        }
        context.beginPath()
        context.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2)
        context.fillStyle = theme === 'dark' ? 'rgba(153, 205, 235, 0.26)' : 'rgba(57, 105, 145, 0.2)'
        context.fill()
      })

      if (pointer.active) {
        const nearby = particles.filter(
          (particle) => Math.hypot(particle.x - pointer.x, particle.y - pointer.y) < 190,
        )

        nearby.forEach((particle) => {
          const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y)
          context.beginPath()
          context.moveTo(pointer.x, pointer.y)
          context.lineTo(particle.x, particle.y)
          const color = theme === 'dark' ? '144, 198, 231' : '47, 111, 159'
          context.strokeStyle = `rgba(${color}, ${0.28 * (1 - distance / 190)})`
          context.stroke()
        })

        for (let first = 0; first < nearby.length; first += 1) {
          for (let second = first + 1; second < nearby.length; second += 1) {
            const point = nearby[first]
            const neighbor = nearby[second]
            const distance = Math.hypot(point.x - neighbor.x, point.y - neighbor.y)
            if (distance < 110) {
              context.beginPath()
              context.moveTo(point.x, point.y)
              context.lineTo(neighbor.x, neighbor.y)
              const color = theme === 'dark' ? '144, 198, 231' : '47, 111, 159'
              context.strokeStyle = `rgba(${color}, ${0.18 * (1 - distance / 110)})`
              context.stroke()
            }
          }
        }
      }
    }

    function animate() {
      draw()
      if (!reducedMotion) frame = window.requestAnimationFrame(animate)
    }

    function onPointerMove(event: PointerEvent) {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
      if (reducedMotion) draw()
    }

    function onPointerLeave() {
      pointer.active = false
      if (reducedMotion) draw()
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="tsparticles-canvas-el"
      style={{ width: '100%', height: '100%', pointerEvents: 'initial' }}
      aria-hidden="true"
    />
  )
}

function CartItem({
  line,
  copy,
  onChange,
  onRemove,
}: {
  line: CartLine
  copy: Copy
  onChange: (amount: number) => void
  onRemove: () => void
}) {
  return (
    <div className="cart-item">
      <div className={`cart-item-art ${line.product.tone}`}>{line.product.art}</div>
      <div className="cart-item-info">
        <span className="product-category">{getCategoryName(line.product.category, copy)}</span>
        <strong>{getProductName(line.product.name, copy)}</strong>
        <span className="cart-item-price">{money(line.product.price)}</span>
        <div className="item-actions">
          <div className="quantity-control" aria-label={`${getProductName(line.product.name, copy)} ${copy.quantity}`}>
            <button type="button" aria-label={`${copy.decrease} ${getProductName(line.product.name, copy)} ${copy.quantity}`} onClick={() => onChange(-1)} disabled={line.quantity === 1}>−</button>
            <span>{line.quantity}</span>
            <button type="button" aria-label={`${copy.increase} ${getProductName(line.product.name, copy)} ${copy.quantity}`} onClick={() => onChange(1)}>+</button>
          </div>
          <button className="remove-button" type="button" onClick={onRemove}>{copy.remove}</button>
        </div>
      </div>
      <strong className="cart-line-total">{money(line.product.price * line.quantity)}</strong>
    </div>
  )
}

function Totals({ subtotal, shipping, label, copy }: { subtotal: number; shipping: number; label: string; copy: Copy }) {
  return (
    <div className="totals">
      <div><span>{copy.subtotal}</span><span>{money(subtotal)}</span></div>
      <div><span>{copy.shipping}</span><span>{label}</span></div>
      <div className="grand-total"><strong>{copy.grandTotal}</strong><strong>{money(subtotal + shipping)}</strong></div>
    </div>
  )
}

function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === 'light' ? (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2v1.5m0 13V18m8-8h-1.5M3.5 10H2m13.66-5.66-1.06 1.06M5.4 14.6l-1.06 1.06m11.32 0-1.06-1.06M5.4 5.4 4.34 4.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M16.5 12.1A7.1 7.1 0 0 1 7.9 3.5a7.1 7.1 0 1 0 8.6 8.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function CartIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 8H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="10" cy="20" r="1" fill="currentColor" /><circle cx="18" cy="20" r="1" fill="currentColor" /></svg>
}

function ArrowRight() {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.5 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function LockIcon() {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><path d="M5.2 7V5a2.8 2.8 0 0 1 5.6 0v2" stroke="currentColor" strokeWidth="1.2" /></svg>
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default App
