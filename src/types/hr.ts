// ============================================================
// BUILDCORE ERP - HR & PAYROLL TYPES
// Part 25: HR / Employee / Labour / Payroll Management
// ============================================================

// ============================================================
// 1. EMPLOYEE MASTER
// ============================================================
export interface Employee {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  photo?: string;
  contact: string;
  address: string;
  emergencyContact: string;
  departmentId: string;
  designationId: string;
  roleId: string;
  projectId?: string;
  siteId?: string;
  joiningDate: string;
  employmentType: EmploymentType;
  reportingManagerId?: string;
  costCenterId?: string;
  bankDetails: BankDetails;
  statutoryInfo: StatutoryInfo;
  documents: EmployeeDocument[];
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

export type EmploymentType = 
  | 'PERMANENT'
  | 'CONTRACT'
  | 'TEMPORARY'
  | 'INTERN'
  | 'CONSULTANT';

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
}

export interface StatutoryInfo {
  panNumber: string;
  aadharNumber: string;
  pfNumber?: string;
  esiNumber?: string;
  panCard?: string;
  aadharCard?: string;
}

export interface EmployeeDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  documentPath: string;
  issueDate?: string;
  expiryDate?: string;
}

export type EmployeeStatus = 
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'TERMINATED'
  | 'RESIGNED'
  | 'SUSPENDED';

// ============================================================
// 2. EMPLOYMENT HISTORY
// ============================================================
export interface EmploymentHistory {
  id: string;
  employeeId: string;
  eventType: EmploymentHistoryEventType;
  eventDate: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  createdBy: string;
  createdAt: string;
}

export type EmploymentHistoryEventType =
  | 'JOINING'
  | 'TRANSFER'
  | 'PROMOTION'
  | 'SALARY_REVISION'
  | 'DESIGNATION_CHANGE'
  | 'PROJECT_TRANSFER'
  | 'REPORTING_MANAGER_CHANGE'
  | 'LEAVE'
  | 'EXIT';

// ============================================================
// 3. LABOUR MASTER
// ============================================================
export interface Labour {
  id: string;
  companyId: string;
  labourId: string;
  name: string;
  trade: string;
  skill: 'SKILLED' | 'SEMI_SKILLED' | 'UNSKILLED';
  labourContractorId?: string;
  projectId: string;
  siteId: string;
  wageRate: number;
  wageMode: WageMode;
  joiningDate: string;
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'ROTATIONAL';
  documents: LabourDocument[];
  safetyStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING';
  status: LabourStatus;
  createdAt: string;
  updatedAt: string;
}

export type WageMode = 
  | 'MONTHLY'
  | 'DAILY'
  | 'WEEKLY'
  | 'PIECE_RATE'
  | 'QUANTITY_BASED'
  | 'ATTENDANCE_BASED';

export interface LabourDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  documentPath: string;
  issueDate?: string;
  expiryDate?: string;
}

export type LabourStatus = 
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'TERMINATED'
  | 'ABSENT';

// ============================================================
// 4. SALARY STRUCTURE
// ============================================================
export interface SalaryStructure {
  id: string;
  companyId: string;
  employeeId: string;
  basic: number;
  hra: number;
  allowances: Allowance[];
  siteAllowance?: number;
  foodAllowance?: number;
  travelAllowance?: number;
  bonus?: number;
  incentive?: number;
  overtimeRate?: number;
  deductions: Deduction[];
  advanceRecovery?: number;
  grossSalary: number;
  netSalary: number;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Allowance {
  id: string;
  allowanceType: string;
  amount: number;
}

export interface Deduction {
  id: string;
  deductionType: string;
  amount: number;
}

// ============================================================
// 5. PAYROLL
// ============================================================
export interface Payroll {
  id: string;
  companyId: string;
  payrollPeriod: string;
  employeeId: string;
  salaryStructureId: string;
  attendance: AttendanceRecord[];
  leaves: LeaveRecord[];
  overtime: OvertimeRecord[];
  grossSalary: number;
  deductions: PayrollDeduction[];
  netSalary: number;
  status: PayrollStatus;
  approvedBy?: string;
  approvedAt?: string;
  postedAt?: string;
  paidAt?: string;
  payslipGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PayrollStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'POSTED'
  | 'PAID'
  | 'CANCELLED';

export interface PayrollDeduction {
  id: string;
  deductionType: string;
  amount: number;
}

// ============================================================
// 6. ATTENDANCE
// ============================================================
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  hoursWorked: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'HOLIDAY';
  shift: string;
  overtime?: number;
  createdBy: string;
  createdAt: string;
}

// ============================================================
// 7. LEAVE MANAGEMENT
// ============================================================
export interface LeaveType {
  id: string;
  companyId: string;
  leaveType: string;
  entitlement: number;
  accrualRate: number;
  carryForward: boolean;
  maxCarryForward?: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export interface HolidayCalendar {
  id: string;
  companyId: string;
  date: string;
  holidayName: string;
  isOptional: boolean;
  createdAt: string;
}

export interface LeaveOnlop {
  id: string;
  employeeId: string;
  date: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

// ============================================================
// 8. OVERTIME
// ============================================================
export interface OvertimeRecord {
  id: string;
  employeeId: string;
  date: string;
  hours: number;
  rate: number;
  amount: number;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

// ============================================================
// 9. ADVANCE
// ============================================================
export interface Advance {
  id: string;
  companyId: string;
  employeeId: string;
  amount: number;
  requestDate: string;
  reason: string;
  status: AdvanceStatus;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  recoveryStartDate?: string;
  recoveryEndDate?: string;
  recoveredAmount: number;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdvanceStatus = 
  | 'REQUESTED'
  | 'APPROVED'
  | 'PAID'
  | 'RECOVERING'
  | 'SETTLED'
  | 'REJECTED';

// ============================================================
// 10. TRAINING
// ============================================================
export interface Training {
  id: string;
  companyId: string;
  trainingName: string;
  trainingType: 'SAFETY_INDUTION' | 'SKILL' | 'CERTIFICATION' | 'OTHER';
  trainer?: string;
  date: string;
  expiryDate?: string;
  attendees: string[];
  certificates: string[];
  status: TrainingStatus;
  createdAt: string;
  updatedAt: string;
}

export type TrainingStatus = 
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED';

// ============================================================
// 11. PERFORMANCE
// ============================================================
export interface PerformanceReview {
  id: string;
  companyId: string;
  employeeId: string;
  reviewPeriod: string;
  reviewerId: string;
  rating: number;
  strengths: string;
  areasForImprovement: string;
  goals: string;
  comments: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 12. TRANSFER HISTORY
// ============================================================
export interface TransferHistory {
  id: string;
  employeeId: string;
  fromProjectId?: string;
  toProjectId?: string;
  fromSiteId?: string;
  toSiteId?: string;
  transferDate: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

// ============================================================
// 13. EXIT
// ============================================================
export interface ExitRecord {
  id: string;
  employeeId: string;
  exitDate: string;
  exitType: 'RESIGNATION' | 'TERMINATION' | 'RETIREMENT' | 'END_OF_CONTRACT';
  reason: string;
  noticePeriod: number;
  lastWorkingDay: string;
  fullAndFinalSettlement: number;
  status: 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 14. LABOUR CONTRACTOR
// ============================================================
export interface LabourContractor {
  id: string;
  companyId: string;
  contractorName: string;
  contactPerson: string;
  contactNumber: string;
  address: string;
  gstNumber?: string;
  panNumber?: string;
  projectId: string;
  siteId: string;
  labourCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 15. HR DASHBOARD KPIs
// ============================================================
export interface HRDashboardKPIs {
  totalManpower: number;
  siteManpower: number;
  labourCount: number;
  staffCount: number;
  presentToday: number;
  absentToday: number;
  onLeave: number;
  overtimeHours: number;
  totalPayroll: number;
  labourCost: number;
  newJoiners: number;
  exits: number;
  trainingCompleted: number;
  documentExpiry: number;
}

// ============================================================
// 16. PROJECT MANPOWER
// ============================================================
export interface ProjectManpower {
  id: string;
  projectId: string;
  date: string;
  staffCount: number;
  skilledLabour: number;
  semiSkilledLabour: number;
  unskilledLabour: number;
  totalLabour: number;
  totalManpower: number;
  createdBy: string;
  createdAt: string;
}
