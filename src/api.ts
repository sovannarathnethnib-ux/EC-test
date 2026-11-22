export type ApiCategory = {
  category_id: number
  name: string
}

export type ApiProduct = {
  product_id: number
  category_id: number
  name: string
  price: string | number
}

export type CreateOrderPayload = {
  customer: {
    first_name: string
    last_name: string
    email: string
    phone: string
    address: string
  }
  shipping_method: 'standard' | 'express' | 'pickup'
  items: { product_id: number; quantity: number }[]
}

export type ApiOrder = {
  order_id: number
  order_number: string
  order_date: string
  status: string
  shipping_method: CreateOrderPayload['shipping_method']
  shipping_amount: number
  total_amount: number
  items: {
    product_id: number
    name: string
    category: string
    quantity: number
    unit_price: number
  }[]
}

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  const payload: unknown = response.headers.get('content-type')?.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return payload as T
}

export function getCategories(): Promise<ApiCategory[]> {
  return request<ApiCategory[]>('/categories')
}

export function getProducts(): Promise<ApiProduct[]> {
  return request<ApiProduct[]>('/products')
}

export function createOrder(order: CreateOrderPayload): Promise<ApiOrder> {
  return request<ApiOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  })
}
