
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Company } from '../types';

/**
 * Fetches all company documents from the 'companies' collection.
 * @returns A promise that resolves to an array of Company objects.
 */
export const getAllCompanies = async (): Promise<Company[]> => {
    try {
        const companiesCollectionRef = collection(db, 'companies');
        const querySnapshot = await getDocs(companiesCollectionRef);
        
        const companies = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Company));

        return companies;
    } catch (error) {
        console.error("Error fetching all companies:", error);
        // Retornar un array vacío o lanzar el error puede ser una opción.
        // Por ahora, para evitar que la app se rompa, retornamos un array vacío.
        return [];
    }
};
