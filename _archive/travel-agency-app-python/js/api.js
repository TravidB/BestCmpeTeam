import { API_BASE } from './config.js'

async function request(method, path, { params, body } = {}) {
  let url = `${API_BASE}${path}`
  if (params) {
    const filtered = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== null && v !== undefined))
    url += `?${new URLSearchParams(filtered)}`
  }
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const detail = data.detail
    const msg = Array.isArray(detail)
      ? detail.map((d) => d.msg || 'invalid value').join('; ')
      : typeof detail === 'string' ? detail : res.statusText
    throw new Error(msg)
  }
  return res.json()
}

export const api = {
  get: (path, params) => request('GET', path, { params }),
  post: (path, body) => request('POST', path, { body }),
  patch: (path, body) => request('PATCH', path, { body }),
  delete: (path) => request('DELETE', path),
}
