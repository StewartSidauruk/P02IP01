import { useEffect, useState, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../configs/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext({
  user: null,
  role: null,
  name: null,
  setUser: () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [isLoadPage, setLoadPage] = useState(true);
  const value = { user, role, name, setUser };

  useEffect(() => {
    setLoadPage(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        setUser(user);
        setRole(docSnap.data().role);
        setName(docSnap.data().name);
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