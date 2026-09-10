// ============================================================
// BUILDCORE ERP - HR & PAYROLL TYPES
// Part 25: Complete HR/Employee/Labour/Payroll Management
// ============================================================

// ============================================================
// 1. EMPLOYEE MASTER
// ============================================================
export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  photo?: string;
  contact: string;
  address: string;
  emergencyContact: string;
  department: string;
  designation: string;
  role: EmployeeRole;
  project?: string;
  site?: string;
  joiningDate: string;
  employmentType: EmploymentType;
  reportingManager?: string;
  costCentre: string;
  bankDetails: BankDetails;
  statutoryInfo: StatutoryInfo;
  documents: EmployeeDocument[];
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeRole = 
  | 'HO_EMPLOYEE'
  | 'SITE_EMPLOYEE'
  | 'ENGINEER'
  | 'SUPERVISOR'
  | 'SKILLED_LABOUR'
  | 'UNSKILLED_LABOUR'
  | 'CONTRACT_LABOUR'
  | 'LABOUR_CONTRACTOR'
  | 'PROJECT_MANPOWER';

export type EmploymentType = 
  | 'PERMANENT'
  | 'CONTRACTUAL'
  | 'TEMPORARY'
  | 'DAILY_WAGE'
  | 'CONTRACT_LABOUR';

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
  issueDate: string;
  expiryDate?: string;
  documentFile?: string;
}

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'ON_LEAVE' | 'RESIGNED';

// ============================================================
// 2. EMPLOYMENT HISTORY
// ============================================================
export interface EmploymentHistory {
  id: string;
  employeeId: string;
  eventType: EmploymentEventType;
  eventDate: string;
  details: EmploymentEventDetails;
  createdBy: string;
  createdAt: string;
}

export type EmploymentEventType = 
  | 'JOINING'
  | 'TRANSFER'
  | 'PROMOTION'
  | 'SALARY_REVISION'
  | 'DESIGNATION_CHANGE'
  | 'PROJECT_TRANSFER'
  | 'MANAGER_CHANGE'
  | 'LEAVE'
  | 'EXIT';

export interface EmploymentEventDetails {
  fromValue?: string;
  toValue?: string;
  project?: string;
  site?: string;
  manager?: string;
  salary?: number;
  designation?: string;
  reason?: string;
}

// ============================================================
// 3. SALARY STRUCTURE
// ============================================================
export interface SalaryStructure {
  id: string;
  employeeId: string;
  basic: number;
  hra: number;
  allowances: Allowance[];
  siteAllowance: number;
  foodAllowance: number;
  travelAllowance: number;
  bonus: number;
  incentive: number;
  overtime: number;
  deductions: Deduction[];
  advanceRecovery: number;
  grossSalary: number;
  netSalary: number;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Allowance {
  id: string;
  name: string;
  amount: number;
  isTaxable: boolean;
}

export interface Deduction {
  id: string;
  name: string;
  amount: number;
  isStatutory: boolean;
}

// ============================================================
// 4. PAYROLL
// ============================================================
export interface Payroll {
  id: string;
  employeeId: string;
  period: string;
  attendance: AttendanceRecord[];
  leaveRecords: LeaveRecord[];
  overtimeRecords: OvertimeRecord[];
  salaryStructure: SalaryStructure;
  grossSalary: number;
  totalDeductions: number;
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
  | 'CALCULATED'
  | 'APPROVED'
  | 'POSTED'
  | 'PAID'
  | 'CANCELLED';

// ============================================================
// 5. CONSTRUCTION WAGE MODES
// ============================================================
export interface WageCalculation {
  id: string;
  employeeId: string;
  period: string;
  wageMode: WageMode;
  calculation: WageCalculationDetails;
  totalWages: number;
  createdAt: string;
}

export type WageMode = 
  | 'MONTHLY'
  | 'DAILY'
  | 'WEEKLY'
  | 'PIECE_RATE'
  | 'QUANTITY_BASED'
  | 'ATTENDANCE_BASED';

export interface WageCalculationDetails {
  baseRate: number;
  units?: number;
  quantity?: number;
  daysWorked?: number;
  overtimeHours?: number;
  overtimeRate?: number;
  pieceRate?: number;
  piecesCompleted?: number;
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
  status: AttendanceStatus;
  hoursWorked: number;
  overtimeHours: number;
  siteId?: string;
  remarks?: string;
  createdAt: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'HOLIDAY' | 'WEEKLY_OFF';

// ============================================================
// 7. LEAVE MANAGEMENT
// ============================================================
export interface LeaveType {
  id: string;
  name: string;
  code: string;
  entitlement: number;
  accrualRate: number;
  carryForward: boolean;
  maxCarryForward?: number;
  isPaid: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  entitlement: number;
  used: number;
  balance: number;
  carryForward: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveRequestStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface HolidayCalendar {
  id: string;
  year: number;
  holidays: Holiday[];
  createdAt: string;
  updatedAt: string;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: 'MANDATORY' | 'OPTIONAL';
  isRecurring: boolean;
}

export interface LossOfPay {
  id: string;
  employeeId: string;
  date: string;
  reason: string;
  days: number;
  createdAt: string;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface ProjectManpower {
  id: string;
  projectId: string;
  employeeId: string;
  siteId: string;
  assignedDate: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

// ============================================================
// 9. ADVANCE
// ============================================================
export interface Advance {
  id: string;
  employeeId: string;
  amount: number;
  reason: string;
  requestDate: string;
  status: AdvanceStatus;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  recoverySchedule: RecoverySchedule[];
  totalRecovered: number;
  balanceAmount: number;
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

export interface RecoverySchedule {
  id: string;
  advanceId: string;
  period: string;
  amount: number;
  recoveredAmount: number;
  status: 'PENDING' | 'RECOVERED';
  recoveredAt?: string;
}

// ============================================================
// 10. TRAINING
// ============================================================
export interface Training {
  id: string;
  employeeId: string;
  trainingType: TrainingType;
  title: string;
  trainer: string;
  startDate: string;
  endDate: string;
  certification?: string;
  certificationExpiry?: string;
  status: TrainingStatus;
  renewalRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TrainingType = 'SAFETY_INDUTION' | 'SKILL' | 'CERTIFICATION' | 'OTHER';
export type TrainingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

// ============================================================
// 11. PERFORMANCE
// ============================================================
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewPeriod: string;
  reviewer: string;
  rating: number;
  strengths: string;
  areasForImprovement: string;
  goals: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 12. TRANSFER HISTORY
// ============================================================
export interface TransferHistory {
  id: string;
  employeeId: string;
  fromProject?: string;
  toProject?: string;
  fromSite?: string;
  toSite?: string;
  transferDate: string;
  reason: string;
  approvedBy: string;
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
  exitInterviewCompleted: boolean;
  clearanceCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 14. LABOUR MASTER
// ============================================================
export interface Labour {
  id: string;
  labourId: string;
  name: string;
  trade: string;
  skill: LabourSkill;
  labourContractor?: string;
  project: string;
  site: string;
  wageRate: number;
  wageMode: WageMode;
  joiningDate: string;
  shift: string;
  documents: LabourDocument[];
  safetyStatus: SafetyStatus;
  status: LabourStatus;
  createdAt: string;
  updatedAt: string;
}

export type LabourSkill = 'UNSKILLED' | 'SEMI_SKILLED' | 'SKILLED' | 'HIGHLY_SKILLED';
export type SafetyStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING';
export type LabourStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

export interface LabourDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  issueDate: string;
  expiryDate?: string;
  documentFile?: string;
}

// ============================================================
// 15. LABOUR CONTRACTOR
// ============================================================
export interface LabourContractor {
  id: string;
  contractorId: string;
  name: string;
  contact: string;
  address: string;
  gstNumber?: string;
  licenceNumber: string;
  licenceExpiry: string;
  labourCount: number;
  projects: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 16. HR DASHBOARD KPIs
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
  payrollProcessed: number;
  payrollPending: number;
  labourCost: number;
  newJoiners: number;
  exits: number;
  trainingScheduled: number;
  trainingCompleted: number;
  documentExpiring: number;
  safetyCompliant: number;
  safetyNonCompliant: number;
}

// ============================================================
// 17. PAYSLIP
// ============================================================
export interface Payslip {
  id: string;
  payrollId: string;
  employeeId: string;
  period: string;
  earnings: PayslipEarning[];
  deductions: PayslipDeduction[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  generatedAt: string;
  generatedBy: string;
}

export interface PayslipEarning {
  name: string;
  amount: number;
}

export interface PayslipDeduction {
  name: string;
  amount: number;
}
