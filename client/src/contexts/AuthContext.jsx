import { useEffect, useState, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../configs/firebase';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadPage, setLoadPage] = useState(true);
  const value = { user, setUser };

  useEffect(() => {
    setLoadPage(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoadPage(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoadPage) {
    return <div>Loading.....</div>;
  }

  return <AuthContext value={value}>{children}</AuthContext>;
}