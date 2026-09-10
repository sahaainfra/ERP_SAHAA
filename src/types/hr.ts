// ============================================================
// BUILDCORE ERP - HR & WORKFORCE MANAGEMENT TYPES
// Part 25: HR / Employee / Labour / Payroll Management
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
  departmentId: string;
  designationId: string;
  roleId: string;
  projectId?: string;
  siteId?: string;
  joiningDate: string;
  employmentType: EmploymentType;
  reportingManagerId?: string;
  costCenterId: string;
  bankDetails: BankDetails;
  statutoryInfo: StatutoryInfo;
  documents: EmployeeDocument[];
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

export type EmploymentType = 'PERMANENT' | 'CONTRACT' | 'TEMPORARY' | 'INTERN';

export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'RESIGNED' | 'SUSPENDED';

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

// ============================================================
// 2. EMPLOYMENT HISTORY
// ============================================================
export interface EmploymentHistory {
  id: string;
  employeeId: string;
  eventType: EmploymentEventType;
  eventDate: string;
  oldValue?: string;
  newValue?: string;
  description: string;
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
  | 'REPORTING_MANAGER_CHANGE'
  | 'LEAVE'
  | 'EXIT';

// ============================================================
// 3. LABOUR MASTER
// ============================================================
export interface Labour {
  id: string;
  labourId: string;
  name: string;
  trade: string;
  skill: SkillLevel;
  labourContractorId?: string;
  projectId: string;
  siteId: string;
  wageRate: number;
  wageMode: WageMode;
  joiningDate: string;
  shift: ShiftType;
  documents: LabourDocument[];
  safetyStatus: SafetyStatus;
  status: LabourStatus;
  createdAt: string;
  updatedAt: string;
}

export type SkillLevel = 'UNSKILLED' | 'SEMI_SKILLED' | 'SKILLED' | 'HIGHLY_SKILLED';

export type WageMode = 'MONTHLY' | 'DAILY' | 'WEEKLY' | 'PIECE_RATE' | 'QUANTITY_BASED' | 'ATTENDANCE_BASED';

export type ShiftType = 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'ROTATIONAL';

export type SafetyStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_TRAINING' | 'UNDER_OBSERVATION';

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
// 4. SALARY STRUCTURE
// ============================================================
export interface SalaryStructure {
  id: string;
  employeeId: string;
  effectiveFrom: string;
  effectiveTo?: string;
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
  grossSalary: number;
  netSalary: number;
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
  deductionType: DeductionType;
}

export type DeductionType = 'PF' | 'ESI' | 'TDS' | 'PROFESSIONAL_TAX' | 'ADVANCE_RECOVERY' | 'OTHER';

// ============================================================
// 5. PAYROLL
// ============================================================
export interface Payroll {
  id: string;
  payrollId: string;
  employeeId: string;
  period: string; // YYYY-MM
  basic: number;
  hra: number;
  allowances: number;
  overtime: number;
  bonus: number;
  incentive: number;
  grossSalary: number;
  deductions: PayrollDeduction[];
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

export interface PayrollDeduction {
  id: string;
  name: string;
  amount: number;
  deductionType: DeductionType;
}

export type PayrollStatus = 'DRAFT' | 'CALCULATED' | 'APPROVED' | 'POSTED' | 'PAID' | 'CANCELLED';

// ============================================================
// 6. CONSTRUCTION WAGE MODES
// ============================================================
export interface WageCalculation {
  id: string;
  labourId: string;
  period: string;
  wageMode: WageMode;
  baseRate: number;
  quantity?: number; // For piece rate / quantity based
  attendanceDays?: number; // For attendance based
  overtimeHours?: number;
  overtimeRate?: number;
  basicWage: number;
  overtimeAmount: number;
  allowances: number;
  deductions: number;
  netWage: number;
  status: WageStatus;
  createdAt: string;
  updatedAt: string;
}

export type WageStatus = 'CALCULATED' | 'APPROVED' | 'PAID';

// ============================================================
// 7. LEAVE MANAGEMENT
// ============================================================
export interface LeaveType {
  id: string;
  name: string;
  code: string;
  isPaid: boolean;
  maxDaysPerYear?: number;
  carryForwardAllowed: boolean;
  maxCarryForward?: number;
  requiresApproval: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LeaveEntitlement {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  entitledDays: number;
  usedDays: number;
  balanceDays: number;
  carryForwardDays: number;
}

export interface LeaveRequest {
  id: string;
  requestId: string;
  employeeId: string;
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface HolidayCalendar {
  id: string;
  year: number;
  holidays: Holiday[];
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  isOptional: boolean;
}

export interface LossOfPay {
  id: string;
  employeeId: string;
  date: string;
  reason: string;
  approvedBy: string;
  createdAt: string;
}

// ============================================================
// 8. ADVANCE
// ============================================================
export interface Advance {
  id: string;
  advanceId: string;
  employeeId: string;
  amount: number;
  purpose: string;
  requestDate: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  recoveryStartDate?: string;
  recoveryEndDate?: string;
  recoveredAmount: number;
  balanceAmount: number;
  status: AdvanceStatus;
  createdAt: string;
  updatedAt: string;
}

export type AdvanceStatus = 'REQUESTED' | 'APPROVED' | 'PAID' | 'PARTIALLY_RECOVERED' | 'FULLY_RECOVERED' | 'REJECTED';

export interface AdvanceRecovery {
  id: string;
  advanceId: string;
  payrollId: string;
  recoveryAmount: number;
  recoveryDate: string;
}

// ============================================================
// 9. TRAINING
// ============================================================
export interface Training {
  id: string;
  trainingId: string;
  name: string;
  type: TrainingType;
  description: string;
  trainer: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  participants: TrainingParticipant[];
  status: TrainingStatus;
  createdAt: string;
  updatedAt: string;
}

export type TrainingType = 'SAFETY_INDUTION' | 'SKILL_TRAINING' | 'CERTIFICATION' | 'REFRESHER';

export type TrainingStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface TrainingParticipant {
  id: string;
  trainingId: string;
  employeeId: string;
  attendanceStatus: 'ATTENDED' | 'ABSENT' | 'PARTIAL';
  certificationObtained: boolean;
  certificationExpiry?: string;
}

export interface Certification {
  id: string;
  employeeId: string;
  certificationName: string;
  certificationNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  documentFile?: string;
}

// ============================================================
// 10. HR DASHBOARD KPIs
// ============================================================
export interface HRDashboardKPIs {
  totalManpower: number;
  siteManpower: number;
  labourCount: number;
  staffCount: number;
  attendanceToday: number;
  attendancePercentage: number;
  overtimeHours: number;
  payrollProcessed: number;
  labourCost: number;
  newJoiners: number;
  exits: number;
  trainingScheduled: number;
  documentExpiring: number;
}

// ============================================================
// 11. ATTENDANCE
// ============================================================
export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  overtimeHours: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE' | 'HOLIDAY' | 'WEEKLY_OFF';

// ============================================================
// 12. PERFORMANCE
// ============================================================
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewPeriod: string;
  reviewDate: string;
  reviewerId: string;
  ratings: PerformanceRating[];
  overallRating: number;
  comments: string;
  goals: PerformanceGoal[];
  status: PerformanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceRating {
  id: string;
  parameter: string;
  rating: number; // 1-5
  comments?: string;
}

export interface PerformanceGoal {
  id: string;
  goal: string;
  targetDate: string;
  status: 'PENDING' | 'ACHIEVED' | 'PARTIAL' | 'NOT_ACHIEVED';
  comments?: string;
}

export type PerformanceStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

// ============================================================
// 13. ATTENDANCE RECORD
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
  remarks?: string;
  createdAt: string;
}

// ============================================================
// 14. LEAVE RECORD
// ============================================================
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
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 15. LEAVE ON LOP
// ============================================================
export interface LeaveOnlop {
  id: string;
  employeeId: string;
  date: string;
  reason: string;
  approvedBy: string;
  createdAt: string;
}

// ============================================================
// 16. OVERTIME RECORD
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
// 17. TRANSFER HISTORY
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
  approvedBy: string;
  createdAt: string;
}

// ============================================================
// 18. EXIT RECORD
// ============================================================
export interface ExitRecord {
  id: string;
  employeeId: string;
  exitDate: string;
  exitType: 'RESIGNATION' | 'TERMINATION' | 'RETIREMENT' | 'END_OF_CONTRACT';
  reason: string;
  noticePeriodDays: number;
  lastWorkingDay: string;
  fullAndFinalSettlement: boolean;
  exitInterviewCompleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 19. LABOUR CONTRACTOR
// ============================================================
export interface LabourContractor {
  id: string;
  contractorId: string;
  name: string;
  contactPerson: string;
  contactNumber: string;
  email?: string;
  address: string;
  gstNumber?: string;
  licenseNumber?: string;
  specialization?: string;
  maxLabourCount: number;
  ratePerLabour?: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 20. PROJECT MANPOWER
// ============================================================
export interface ProjectManpower {
  id: string;
  projectId: string;
  date: string;
  totalLabour: number;
  totalManpower: number;
  skilledLabour: number;
  semiSkilledLabour: number;
  unskilledLabour: number;
  supervisors: number;
  engineers: number;
  createdAt: string;
}
