export default {
  setUser(user) {
    localStorage.setItem('user', user)
  },

  getUser() {
    return localStorage.getItem('user')
  },

  removeUser() {
    localStorage.removeItem('user')
  },

  setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
  },

  getUserData() {
    return JSON.parse(localStorage.getItem('userData'))
  },

  removeUserData() {
    localStorage.removeItem('userData')
  },

  setUserPermissions(userPermissions) {
    localStorage.setItem('userPermissions', JSON.stringify(userPermissions))
  },

  getUserPermissions() {
    return JSON.parse(localStorage.getItem('userPermissions'))
  },

  removeUserPermissions() {
    localStorage.removeItem('userPermissions')
  },

  isUserLoggedIn() {
    return localStorage.getItem('userData') && localStorage.getItem('accessToken')
  },
}
