import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';

// Definimos el tipo de valor que tendrá nuestro contexto para que TypeScript sepa qué esperar.
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

// Creamos el contexto con un valor inicial por defecto.
const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

// Creamos un "hook" personalizado. Esto es una función para que otros componentes
// puedan acceder fácilmente a la información del contexto sin escribir mucho código.
export const useAuth = () => {
  return useContext(AuthContext);
};

// Creamos el componente "Proveedor". Su trabajo es envolver nuestra aplicación
// y proveer la información del usuario a todos los componentes que estén dentro.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta una vez cuando el componente se monta.
  useEffect(() => {
    // onAuthStateChanged es un "oyente" mágico de Firebase.
    // Se ejecuta automáticamente cuando un usuario inicia sesión o la cierra.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Guardamos el usuario (o null si cierra sesión)
      setLoading(false); // Dejamos de "cargar" una vez que tenemos la respuesta
    });

    // Esta función se ejecuta cuando el componente se "desmonta" (deja de usarse).
    // Sirve para limpiar el oyente y evitar problemas de memoria.
    return unsubscribe;
  }, []); // El array vacío [] significa que este efecto solo se ejecuta una vez.

  const value = {
    currentUser,
    loading,
  };

  // Finalmente, el proveedor devuelve el contexto con el valor actualizado.
  // No mostramos la aplicación (children) hasta que la carga inicial termine.
  // Esto evita parpadeos o que se muestren páginas incorrectas por un instante.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
