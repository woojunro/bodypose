import { createContext } from 'react';
const LoginContext = createContext({
  loggedIn: false,
  setLoggedIn: () => {},
});

export default LoginContext;
