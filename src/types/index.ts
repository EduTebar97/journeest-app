
import { Timestamp } from 'firebase/firestore';

// =================================================================
// Core User & Company Interfaces (Remain Unchanged)
// =================================================================

export interface Company {
  id: string;
  name: string;
  adminId: string;
  createdAt: Timestamp;
}

export interface UserProfile {
    uid: string;
    email: string | null;
    role: 'client' | 'futurlogix';
    name?: string;
    lastName?: string;
    position?: string;
    companyId?: string; 
}

export interface Collaborator {
    id: string;
    companyId: string;
    name: string;
    lastName: string;
    email: string;
    position: string;
}

// =================================================================
// NEW MODULAR ARCHITECTURE: DIAGNOSTIC CONFIGURATION
// These interfaces define the structure for creating dynamic forms.
// They will be stored in Firestore (e.g., in a 'diagnostic_modules' collection).
// =================================================================

/**
 * Defines the type of input control to be rendered in the UI for a question.
 */
export type QuestionType = 
  | 'text_area'       // For long-form text answers
  | 'text_input'      // For short, single-line answers
  | 'slider'          // For subjective ratings (e.g., 0-100)
  | 'multiple_choice' // For selecting one option from a list
  | 'checkboxes'      // For selecting multiple options from a list
  | 'dynamic_list';   // For adding a variable number of items (e.g., list of KPIs)

/**
 * Represents a single question within a diagnostic module.
 */
export interface Question {
  id: string; // Unique identifier for the question (e.g., 'strategic_mission')
  label: string; // The question text presented to the user (e.g., 'Describe la misión de tu departamento.')
  description?: string; // Optional helper text to provide context.
  type: QuestionType;
  options?: string[]; // Used for 'multiple_choice' and 'checkboxes'
  min?: number; // Used for 'slider'
  max?: number; // Used for 'slider'
}

/**
 * A self-contained block of questions. Represents one section in the form sidebar.
 * Example: "Análisis Estratégico", "Evaluación de Tecnología".
 */
export interface DiagnosticModule {
  id: string; // Unique identifier for the module (e.g., 'module_strategic')
  name: string; // Display name for the module (e.g., 'Análisis Estratégico')
  questions: Question[];
}

/**
 * Defines which diagnostic modules should be used for a specific type of business area.
 * Example: "Marketing", "Operaciones", "Recursos Humanos".
 */
export interface AreaTemplate {
  id: string; // Unique identifier for the template (e.g., 'template_marketing')
  name: string; // Display name for the template (e.g., 'Plantilla para Marketing y Ventas')
  description: string;
  moduleIds: string[]; // An array of DiagnosticModule IDs
}


// =================================================================
// NEW MODULAR ARCHITECTURE: DATA STORAGE
// These interfaces define how user-submitted data is stored.
// =================================================================

/**
 * Represents the answer to a single question.
 * The type of 'value' will depend on the question's 'type'.
 */
export type Answer = string | number | string[] | Array<{ id: string, value: string }>;

/**
 * Stores the form data in a flexible, modular way.
 * It's a dictionary where the key is the DiagnosticModule ID, and the value
 * is another dictionary containing answers for the questions in that module.
 * 
 * Example:
 * {
 *   'module_strategic': {
 *     'strategic_mission': 'Nuestra misión es...',
 *     'strategic_kpis': [{id: '1', value: 'Aumentar MQLs'}]
 *   },
 *   'module_technology': {
 *     'tech_maturity': 80
 *   }
 * }
 */
export type ModularFormData = Record<string, Record<string, Answer>>;

/**
 * The Area document, updated to work with the new modular system.
 */
export interface Area {
  id: string;
  companyId: string;
  name: string; // The specific name given by the user, e.g., "Marketing - Equipo Latam"
  templateId: string; // ID of the AreaTemplate used to generate the form for this area.
  
  responsible: {
    name: string;
    email: string;
  };
  
  status: 'pending' | 'in_progress' | 'completed' | 'report_ready';
  formId: string; // Unique URL slug for the form link
  
  formData?: ModularFormData; // Using the new flexible data structure
  
  reportDraft?: string;
  finalReport?: string;
  createdAt: Timestamp;
  completedAt?: Timestamp;
}
