const demoAdminCredentials = {
  username: 'test@mail.com',
  password: 'demo123',
}

const demoAdminSessionKey = 'beans-in-a-pot-demo-admin'

export function authenticateDemoAdmin(username: string, password: string) {
  if (
    username.trim().toLowerCase() !== demoAdminCredentials.username ||
    password !== demoAdminCredentials.password
  ) {
    return false
  }

  window.sessionStorage.setItem(demoAdminSessionKey, 'authenticated')
  return true
}

export function hasDemoAdminSession() {
  return (
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(demoAdminSessionKey) === 'authenticated'
  )
}

export function endDemoAdminSession() {
  window.sessionStorage.removeItem(demoAdminSessionKey)
}
