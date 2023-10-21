/* eslint-disable @typescript-eslint/no-explicit-any */
export const buildQuery = (query: any) => {
  const conditions = []

  if (query.search) {
    conditions.push({ title: { $regex: new RegExp(query.search, 'i') } })
  }

  if (query.minPrice || query.maxPrice) {
    const priceCondition: any = {}
    if (query.minPrice) priceCondition.$gte = query.minPrice
    if (query.maxPrice) priceCondition.$lte = query.maxPrice
    conditions.push({ price: priceCondition })
  }

  if (query.category && query.category !== 'all') {
    conditions.push({ category: query.category })
  }

  if (query.status && query.status !== 'all') {
    conditions.push({ status: query.status })
  }

  return conditions.length ? { $and: conditions } : {}
}
