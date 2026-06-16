// ─── Projects ───────────────────────────────────────────
export interface Project {
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  location?: string;
  region?: string;
  district?: string;
  address?: string;
  latitude: number;
  longitude: number;
  ownerId: number;
  investorName?: string;
  allocatedMoney?: number;
  spentMoney?: number;
  startDate?: string;
  plannedEndDate?: string;
  actualEndDate?: string | null;
  ownerFullName?: string;
  owner?: { id: number; fullName: string; username: string };
  cameraUrl?: string;
}

export interface ProjectCreateDto {
  name: string;
  description: string;
  type: string;
  status: string;
  ownerId: number;
  latitude: number;
  longitude: number;
  region?: string;
  district?: string;
  address?: string;
  investorName?: string;
  allocatedMoney?: number;
  spentMoney?: number;
  startDate?: string;
  plannedEndDate?: string;
  cameraUrl?: string;
}

// ─── Problems ───────────────────────────────────────────
export interface Problem {
  id: number;
  projectId: number;
  projectName?: string;
  project?: { id: number; name: string };
  createdById: number;
  createdByFullName?: string;
  title: string;
  description: string;
  type: string;
  status: string;
  department?: string;
  responsibleDepartment?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  resolution?: string;
}

export interface ProblemCreateDto {
  projectId: number;
  createdById: number;
  title: string;
  description: string;
  type: string;
  responsibleDepartment: string;
  latitude?: number;
  longitude?: number;
}

export interface ProblemUpdateDto {
  title?: string;
  description?: string;
  status?: string;
  responsibleDepartment?: string;
  resolution?: string;
}

// ─── Contracts ──────────────────────────────────────────
export interface Contract {
  id: number;
  projectId: number;
  project?: { id: number; name: string };
  contractNumber: string;
  amount: number;
  contractDate: string;
  endDate?: string;
  description: string;
  status?: string;
}

export interface ContractCreateDto {
  projectId: number;
  contractNumber: string;
  amount: number;
  contractDate: string;
  description: string;
}

export interface ContractUpdateDto {
  contractNumber?: string;
  amount?: number;
  contractDate?: string;
  description?: string;
}

// ─── Users ──────────────────────────────────────────────
export interface ApiUser {
  id: number;
  fullName: string;
  phone: string;
  username: string;
  role: string;
  department?: string;
  organizationType?: string;
  active: boolean;
}

export interface UserCreateDto {
  fullName: string;
  phone: string;
  username: string;
  password: string;
  role: string;
  department?: string;
  organizationType?: string;
}

export interface UserUpdateDto extends UserCreateDto {
  active: boolean;
}

// ─── Dashboard ──────────────────────────────────────────
export interface DashboardStats {
  totalProjects: number;
  jarayonda: number;
  tugallangan: number;
  muammoli: number;
  kechikkan: number;
  totalProblems: number;
}

// ─── Files ──────────────────────────────────────────────
export interface FileItem {
  id: number;
  title: string;
  fileType: "IMAGE" | "DOCUMENT" | "VIDEO" | string;
  fileName: string;
  fileUrl: string;
  contentType: string;
  size: number;
  projectId?: number;
  problemId?: number;
}

// ─── Tasks ──────────────────────────────────────────────
export interface ProjectTask {
  id: number;
  projectId?: number;
  projectName?: string;
  orderNumber?: number;
  title?: string;
  description?: string;
  unit?: string | null;
  totalAmount?: number | null;
  amount2026?: number | null;
  amount2027?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string;
  completed?: boolean;
}

// ─── Task Groups ────────────────────────────────────────
export interface ProjectTaskGroup {
  decision: string;
  tasks: ProjectTask[];
}

// ─── Me ─────────────────────────────────────────────────
export interface MeProjects { projects: Project[] }
export interface MeProblems { problems: Problem[] }

// ─── Project Updates ────────────────────────────────────
export interface ProjectUpdate {
  id: number;
  projectId: number;
  projectName?: string;
  title: string;
  description?: string;
  status: string;
  imageUrl?: string;
  createdByFullName?: string;
  createdAt: string;
}
