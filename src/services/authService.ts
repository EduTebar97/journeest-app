
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp, collection, addDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile, Company } from '../types';

// Define the shape of the data needed for registration
interface RegistrationData {
    email: string;
    password: string;
    companyData: { name: string; brand: string; type: string; };
    adminProfile: { name: string; position: string; phone?: string; };
    initialObjectives: string[];
}

/**
 * Registra una nueva empresa y su administrador.
 * Esta es una operación crítica que involucra múltiples escrituras en la base de datos.
 * Usamos un 'write batch' para asegurar que todas las operaciones se completen o ninguna lo haga.
 */
export const registerAndCreateCompany = async (data: RegistrationData): Promise<UserProfile> => {
  const { email, password, companyData, adminProfile, initialObjectives } = data;

  // 1. Crear el usuario en Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // 2. Preparar todas las escrituras a Firestore en un batch
  const batch = writeBatch(db);

  // 2.1. Crear el documento de la compañía
  const companyDocRef = doc(collection(db, 'companies')); // Genera un ID por adelantado
  const newCompany = {
    id: companyDocRef.id,
    adminId: firebaseUser.uid,
    name: companyData.name,
    brandName: companyData.brand,
    businessType: companyData.type,
    onboardingObjectives: initialObjectives,
    createdAt: Timestamp.now(),
  };
  batch.set(companyDocRef, newCompany);

  // 2.2. Crear el perfil del usuario administrador
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  const newUserProfile: UserProfile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    role: 'client', // Todos los nuevos registros son 'client' por defecto
    companyId: companyDocRef.id,
    name: adminProfile.name,
    position: adminProfile.position,
    phone: adminProfile.phone || '', // Asegurar que el campo existe
  };
  batch.set(userDocRef, newUserProfile);
  
  // 3. Ejecutar todas las operaciones de escritura atómicamente
  try {
    await batch.commit();
    return newUserProfile;
  } catch (error) {
    // Si el batch falla, el usuario de Auth queda huérfano.
    // Esto es raro, pero en una app de producción robusta, se usaría una
    // Cloud Function para limpiar usuarios de Auth sin perfil de Firestore.
    console.error("Error committing batch for registration:", error);
    // Podríamos intentar eliminar el usuario de Auth aquí, pero es complejo y puede fallar.
    throw new Error("Error al guardar los datos de la empresa en la base de datos.");
  }
};


// --- Otras funciones (sin cambios) ---

/**
 * Inicia sesión de un usuario y devuelve su perfil.
 */
export const signIn = async (email: string, password:string): Promise<UserProfile> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userProfile = await getUserProfile(userCredential.user.uid);
  if (!userProfile) {
    throw new Error("Usuario autenticado pero no se encontró el perfil en Firestore.");
  }
  return userProfile;
};

/**
 * Cierra la sesión del usuario actual.
 */
export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Obtiene el perfil de un usuario desde Firestore.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);
  return userDocSnap.exists() ? (userDocSnap.data() as UserProfile) : null;
};
