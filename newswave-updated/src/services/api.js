const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options,
  })

  const text = await res.text()

  try {
    return JSON.parse(text)
  } catch {
    console.error('❌ Non-JSON response:', text)
    throw new Error('Invalid JSON response')
  }
}

export const tickerAPI = {
  getActive:  ()         => request('/api/tickers/active'),
  getAll:     ()         => request('/api/tickers/all'),
  create:     (data)     => request('/api/tickers',               { method: 'POST',   body: JSON.stringify(data) }),
  update:     (id, data) => request(`/api/tickers/${id}`,         { method: 'PUT',    body: JSON.stringify(data) }),
  enable:     (id)       => request(`/api/tickers/${id}/enable`,  { method: 'PATCH' }),
  disable:    (id)       => request(`/api/tickers/${id}/disable`, { method: 'PATCH' }),
  remove:     (id)       => request(`/api/tickers/${id}`,         { method: 'DELETE' }),
}

export const newsAPI = {
  getAll:        (page=0, size=10)    => request(`/api/news?page=${page}&size=${size}`),
  getById:       (id)                 => request(`/api/news/${id}`),
  getBySlug:     (slug)               => request(`/api/news/slug/${slug}`),
  getFeatured:   ()                   => request('/api/news/featured'),
  getTrending:   ()                   => request('/api/news/trending'),
  getByCategory: (cat,page=0,size=10) => request(`/api/news/category/${cat}?page=${page}&size=${size}`),
  search:        (q)                  => request(`/api/news/search?q=${encodeURIComponent(q)}`),
  create:        (data)               => request('/api/news',               { method: 'POST',   body: JSON.stringify(data) }),
  update:        (id, data)           => request(`/api/news/${id}`,         { method: 'PUT',    body: JSON.stringify(data) }),
  toggleTrending:(id)                 => request(`/api/news/${id}/trending`,{ method: 'PATCH' }),
  disable:       (id)                 => request(`/api/news/${id}/disable`, { method: 'PATCH' }),
  // enable: re-activates by updating isActive=true via PUT
  enable:        (id, currentData)    => request(`/api/news/${id}/enable`,  { method: 'PATCH' }),
  incrementViews:(id)                 => request(`/api/news/${id}/views`,   { method: 'PATCH' }),
  remove:        (id)                 => request(`/api/news/${id}`,         { method: 'DELETE' }),
}

export const weatherAPI = {
  getWeather: (city) => request(`/weather?city=${encodeURIComponent(city)}`)
}

export const liveAPI = {
  get:    ()     => request('/api/live'),
  save:   (data) => request('/api/live', { method: 'POST', body: JSON.stringify(data) }),
  update: (data) => request('/api/live', { method: 'PUT',  body: JSON.stringify(data) }),
}

export const videoAPI = {
  getAll:    (page=0, size=12) => request(`/api/videos?page=${page}&size=${size}`),
  getById:   (id)              => request(`/api/videos/${id}`),
  getFeatured: ()              => request('/api/videos/featured'),
  create:    (data)            => request('/api/videos',        { method: 'POST',   body: JSON.stringify(data) }),
  update:    (id, data)        => request(`/api/videos/${id}`,  { method: 'PUT',    body: JSON.stringify(data) }),
  remove:    (id)              => request(`/api/videos/${id}`,  { method: 'DELETE' }),
  incrementViews: (id)         => request(`/api/videos/${id}/views`, { method: 'PATCH' }),
}
