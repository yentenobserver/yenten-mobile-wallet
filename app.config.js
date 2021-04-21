import 'dotenv/config';

export default ({ config }) => {    
    return {
      ...config,
      extra: {
        firebase: {
          apiKey: process.env.REACT_APP_API_KEY,
          authDomain: process.env.REACT_APP_AUTH_DOMAIN,
          projectId: process.env.REACT_APP_PROJECT_ID,
          storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
          messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
          appId: process.env.REACT_APP_APPID
        },
        blockchain:{
          apiKey: process.env.REACT_APP_BC_API_KEY,
          feeAddress: process.env.REACT_APP_BC_FEE_ADDR,
        }
        

      }
    };
  };