export const defaultSession = {
  username: "",
  isLoggedIn: false
}

export const sessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "iron-example-app-router-swr",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === "production"
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
