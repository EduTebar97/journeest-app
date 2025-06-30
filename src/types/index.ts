// src/types/index.ts

export interface CompanyData {
  legalName: string;
  brandName: string;
  country: string;
  businessType: string;
  propertyCount: number;
  roomCount: number;
}

export interface AdminContact {
  fullName: string;
  position: string;
  email: string;
  phone: string;
}

export interface CompanyObjective {
  increaseRevenue: boolean;
  reduceCosts: boolean;
  automateProcesses: boolean;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  responsible: {
    name: string;
    position: string;
    email: string;
  };
  deadline: string;
  // TIPO DE STATUS UNIFICADO Y CORRECTO
  status: 'Pendiente' | 'En proceso' | 'Completada' | 'Error al generar informe';
  companyId: string;
  // AÑADIMOS LAS PROPIEDADES QUE FALTABAN COMO OPCIONALES
  summary?: AreaSummary;
  processes?: AreaProcess[];
  kpis?: AreaKPI[];
  tools?: AreaTool[];
  problems?: AreaProblem[];
  ideas?: AreaIdea[];
  attachments?: AreaAttachment[];
  supportingDocs?: { name: string; url: string }[];
}

export interface AreaSummary {
  description: string;
  employeeCount: number;
  temporality: 'constante' | 'temporada' | 'eventos';
}

export interface ProcessTask {
  name: string;
  duration: number; // en minutos
  responsible: string;
}

export interface AreaProcess {
  id: string;
  name: string;
  trigger: string;
  tasks: ProcessTask[];
  sla: string;
}

export interface AreaKPI {
    id: string;
    name: string;
    formula: string;
    frequency: string;
    target: string;
}

export interface AreaTool {
  id: string;
  name: string;
  category: string;
  hasApi: boolean;
  annualCost: number;
  satisfaction: number; // de 1 a 5
}

export interface AreaProblem {
  id: string;
  description: string;
  resourceLost: string;
  impact: string;
  severity: number; // de 1 a 10
  isRegulatoryRisk: boolean;
}

export interface AreaIdea {
  id: string;
  description: string;
  urgency: number; // de 0 a 10
  isQuickWin: boolean;
}

export interface AreaAttachment {
  name: string;
  url: string;
}