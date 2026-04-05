import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'eu-central-1_ycn9oj84y',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '58rolqun12sg15evv6mv0l3u2m',
      identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || 'eu-central-1:d3e33dc6-d1be-46ea-b306-d869317b29c2',
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'livecenter-production-6p4sdh.auth.eu-central-1.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [typeof window !== 'undefined' ? window.location.origin : 'https://dl5iyvnws81xx.amplifyapp.com'],
          redirectSignOut: [typeof window !== 'undefined' ? window.location.origin : 'https://dl5iyvnws81xx.amplifyapp.com'],
          responseType: 'code'
        }
      }
    }
  }
})