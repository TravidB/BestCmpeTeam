import { api } from './api.js'

const USER_ID_KEY = 'booking_user_id'
const EMAIL_KEY = 'auth_email'
const IS_ADMIN_KEY = 'auth_is_admin'

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
  isAdmin() {
    return localStorage.getItem(IS_ADMIN_KEY) === 'true'
  },
  async signIn(email, password) {
    try {
      const result = await api.get('/users/login', { email, password })
      localStorage.setItem(USER_ID_KEY, String(result.User_ID))
      localStorage.setItem(EMAIL_KEY, email.trim())
      localStorage.setItem(IS_ADMIN_KEY, String(!!result.is_admin))
      return { success: true, isAdmin: !!result.is_admin }
    } catch (err) {
      return { success: false, error: err.message || 'Invalid email or password.' }
    }
  },
  async register({ firstName, lastName, email, phone, password }) {
    try {
      const result = await api.post('/users/register', {
        First_Name: firstName,
        Last_Name: lastName,
        Email: email,
        Phone_Number: phone || null,
        Password: password,
      })
      localStorage.setItem(USER_ID_KEY, String(result.User_ID))
      localStorage.setItem(EMAIL_KEY, email.trim())
      localStorage.setItem(IS_ADMIN_KEY, 'false')
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed.' }
    }
  },
  signOut() {
    localStorage.removeItem(USER_ID_KEY)
    localStorage.removeItem(EMAIL_KEY)
    localStorage.removeItem(IS_ADMIN_KEY)
  },
}
