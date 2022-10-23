// ** Auth Endpoints
export default {
  loginEndpoint: '/glf_user_auth',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/glf_user_auth',
  logoutEndpoint: '/jwt/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
  userDataKeyName: 'userData'
}
