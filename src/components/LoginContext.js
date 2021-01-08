import { createContext } from 'react';
const LoginContext = createContext({
  logedIn: false,
  setLogedIn: () => {},
});

export default LoginContext;
