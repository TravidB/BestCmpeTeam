import { api } from './api.js'

const USER_ID_KEY = 'booking_user_id'
const EMAIL_KEY = 'auth_email'

export const auth = {
  getUserId() {
    const v = Number(localStorage.getItem(USER_ID_KEY))
    return Number.isInteger(v) && v > 0 ? v : null
  },
  getEmail() {
    return localStorage.getItem(EMAIL_KEY) || ''
  },
  isAuthenticated() {
    return this.getUserId() !== null
  },
  async signIn(email, password) {
    const result = await api.get('/users/login', { email, password })
    localStorage.setItem(USER_ID_KEY, String(result.User_ID))
    localStorage.setItem(EMAIL_KEY, email.trim())
    return result
  },
  signOut() {
    localStorage.removeItem(USER_ID_KEY)
    localStorage.removeItem(EMAIL_KEY)
  },
}
