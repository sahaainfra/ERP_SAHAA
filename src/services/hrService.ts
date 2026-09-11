// ============================================================
// BUILDCORE ERP - HR & WORKFORCE MANAGEMENT SERVICE
// Part 25: HR / Employee / Labour / Payroll Management
// ============================================================

import type {
  Employee,
  EmploymentHistory,
  Labour,
  SalaryStructure,
  Payroll,
  AttendanceRecord,
  LeaveType,
  LeaveRecord,
  HolidayCalendar,
  LossOfPay,
  OvertimeRecord,
  Advance,
  Training,
  PerformanceReview,
  TransferHistory,
  ExitRecord,
  LabourContractor,
  ProjectManpower,
  EmployeeDocument
} from '../types/hr';

export class HRService {
  private static instance: HRService;
  
  private employees: Map<string, Employee> = new Map();
  private employmentHistory: Map<string, EmploymentHistory[]> = new Map();
  private labour: Map<string, Labour> = new Map();
  private salaryStructures: Map<string, SalaryStructure[]> = new Map();
  private payrolls: Map<string, Payroll[]> = new Map();
  private attendanceRecords: Map<string, AttendanceRecord[]> = new Map();
  private leaveTypes: Map<string, LeaveType> = new Map();
  private leaveRecords: Map<string, LeaveRecord[]> = new Map();
  private holidayCalendars: Map<string, HolidayCalendar> = new Map();
  private lossOfPayRecords: Map<string, LossOfPay[]> = new Map();
  private overtimeRecords: Map<string, OvertimeRecord[]> = new Map();
  private advances: Map<string, Advance[]> = new Map();
  private trainings: Map<string, Training> = new Map();
  private performanceReviews: Map<string, PerformanceReview[]> = new Map();
  private transferHistory: Map<string, TransferHistory[]> = new Map();
  private exitRecords: Map<string, ExitRecord[]> = new Map();
  private labourContractors: Map<string, LabourContractor> = new Map();
  private projectManpower: Map<string, ProjectManpower[]> = new Map();

  private constructor() {}

  static getInstance(): HRService {
    if (!HRService.instance) {
      HRService.instance = new HRService();
    }
    return HRService.instance;
  }

  // ============================================================
  // EMPLOYEE MANAGEMENT
  // ============================================================

  createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Employee {
    const id = `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const employee: Employee = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.employees.set(id, employee);

    // Create joining history
    this.addEmploymentHistory({
      employeeId: id,
      eventType: 'JOINING',
      eventDate: data.joiningDate,
      details: { project: data.project, site: data.site },
      createdBy: 'system',
    });

    return employee;
  }

  getEmployee(id: string): Employee | undefined {
    return this.employees.get(id);
  }

  getEmployeesByProject(projectId: string): Employee[] {
    return Array.from(this.employees.values()).filter(e => e.project === projectId);
  }

  getEmployeesBySite(siteId: string): Employee[] {
    return Array.from(this.employees.values()).filter(e => e.site === siteId);
  }

  updateEmployee(id: string, updates: Partial<Employee>): void {
    const employee = this.employees.get(id);
    if (!employee) return;

    const updated = { ...employee, ...updates, updatedAt: new Date().toISOString() };
    this.employees.set(id, updated);
  }

  // ============================================================
  // EMPLOYMENT HISTORY
  // ============================================================

  addEmploymentHistory(data: Omit<EmploymentHistory, 'id' | 'createdAt'>): EmploymentHistory {
    const history: EmploymentHistory = {
      ...data,
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    const histories = this.employmentHistory.get(data.employeeId) || [];
    histories.push(history);
    this.employmentHistory.set(data.employeeId, histories);

    return history;
  }

  getEmploymentHistory(employeeId: string): EmploymentHistory[] {
    return this.employmentHistory.get(employeeId) || [];
  }

  // ============================================================
  // LABOUR MANAGEMENT
  // ============================================================

  createLabour(data: Omit<Labour, 'id' | 'createdAt' | 'updatedAt'>): Labour {
    const id = `lab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const labour: Labour = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.labour.set(id, labour);
    return labour;
  }

  getLabour(id: string): Labour | undefined {
    return this.labour.get(id);
  }

  getLabourByProject(projectId: string): Labour[] {
    return Array.from(this.labour.values()).filter(l => l.project === projectId);
  }

  getLabourBySite(siteId: string): Labour[] {
    return Array.from(this.labour.values()).filter(l => l.site === siteId);
  }

  updateLabour(id: string, updates: Partial<Labour>): void {
    const labour = this.labour.get(id);
    if (!labour) return;

    const updated = { ...labour, ...updates, updatedAt: new Date().toISOString() };
    this.labour.set(id, updated);
  }

  // ============================================================
  // SALARY STRUCTURE
  // ============================================================

  createSalaryStructure(data: Omit<SalaryStructure, 'id' | 'grossSalary' | 'netSalary' | 'createdAt' | 'updatedAt'>): SalaryStructure {
    const id = `sal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const allowancesTotal = data.allowances.reduce((sum, a) => sum + a.amount, 0);
    const grossSalary = data.basic + data.hra + allowancesTotal + 
                       (data.siteAllowance || 0) + (data.foodAllowance || 0) + 
                       (data.travelAllowance || 0) + (data.bonus || 0) + (data.incentive || 0);
    
    const deductionsTotal = data.deductions.reduce((sum, d) => sum + d.amount, 0);
    const netSalary = grossSalary - deductionsTotal;

    const salary: SalaryStructure = {
      ...data,
      id,
      grossSalary,
      netSalary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const salaries = this.salaryStructures.get(data.employeeId) || [];
    salaries.push(salary);
    this.salaryStructures.set(data.employeeId, salaries);

    return salary;
  }

  getSalaryStructure(employeeId: string): SalaryStructure[] {
    return this.salaryStructures.get(employeeId) || [];
  }

  getCurrentSalary(employeeId: string): SalaryStructure | undefined {
    const salaries = this.salaryStructures.get(employeeId) || [];
    const now = new Date();
    return salaries.find(s => {
      const effectiveFrom = new Date(s.effectiveFrom);
      const effectiveTo = s.effectiveTo ? new Date(s.effectiveTo) : new Date('9999-12-31');
      return now >= effectiveFrom && now <= effectiveTo;
    });
  }

  // ============================================================
  // PAYROLL
  // ============================================================

  createPayroll(data: Omit<Payroll, 'id' | 'grossSalary' | 'netSalary' | 'totalDeductions' | 'status' | 'payslipGenerated' | 'createdAt' | 'updatedAt'>): Payroll {
    const id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const grossSalary = data.salaryStructure.grossSalary;
    const totalDeductions = data.salaryStructure.deductions.reduce((sum: number, d) => sum + d.amount, 0);
    const netSalary = data.salaryStructure.netSalary;

    const payroll: Payroll = {
      ...data,
      id,
      grossSalary,
      netSalary,
      totalDeductions,
      status: 'CALCULATED',
      payslipGenerated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const payrolls = this.payrolls.get(data.employeeId) || [];
    payrolls.push(payroll);
    this.payrolls.set(data.employeeId, payrolls);

    return payroll;
  }

  getPayroll(employeeId: string): Payroll[] {
    return this.payrolls.get(employeeId) || [];
  }

  getPayrollByPeriod(employeeId: string, period: string): Payroll | undefined {
    const payrolls = this.payrolls.get(employeeId) || [];
    return payrolls.find(p => p.period === period);
  }

  updatePayrollStatus(id: string, status: Payroll['status']): void {
    for (const [employeeId, payrolls] of this.payrolls.entries()) {
      const payroll = payrolls.find(p => p.id === id);
      if (payroll) {
        payroll.status = status;
        payroll.updatedAt = new Date().toISOString();
        
        if (status === 'PAID') {
          payroll.paidAt = new Date().toISOString();
        }
        break;
      }
    }
  }

  // ============================================================
  // ATTENDANCE
  // ============================================================

  createAttendanceRecord(data: Omit<AttendanceRecord, 'id' | 'hoursWorked' | 'createdAt'>): AttendanceRecord {
    const id = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let hoursWorked = 0;
    if (data.checkIn && data.checkOut) {
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);
      hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }

    const record: AttendanceRecord = {
      ...data,
      id,
      hoursWorked,
      createdAt: new Date().toISOString(),
    };

    const records = this.attendanceRecords.get(data.employeeId) || [];
    records.push(record);
    this.attendanceRecords.set(data.employeeId, records);

    return record;
  }

  getAttendanceRecords(employeeId: string): AttendanceRecord[] {
    return this.attendanceRecords.get(employeeId) || [];
  }

  getAttendanceByDate(employeeId: string, date: string): AttendanceRecord | undefined {
    const records = this.attendanceRecords.get(employeeId) || [];
    return records.find(r => r.date === date);
  }

  // ============================================================
  // LEAVE MANAGEMENT
  // ============================================================

  createLeaveType(data: Omit<LeaveType, 'id' | 'createdAt' | 'updatedAt'>): LeaveType {
    const id = `lt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const leaveType: LeaveType = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.leaveTypes.set(id, leaveType);
    return leaveType;
  }

  getLeaveTypes(): LeaveType[] {
    return Array.from(this.leaveTypes.values());
  }

  createLeaveRecord(data: Omit<LeaveRecord, 'id' | 'days' | 'createdAt' | 'updatedAt'>): LeaveRecord {
    const id = `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fromDate = new Date(data.fromDate);
    const toDate = new Date(data.toDate);
    const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const record: LeaveRecord = {
      ...data,
      id,
      days,
      createdAt: new Date().toISOString(),
    };

    const records = this.leaveRecords.get(data.employeeId) || [];
    records.push(record);
    this.leaveRecords.set(data.employeeId, records);

    return record;
  }

  getLeaveRecords(employeeId: string): LeaveRecord[] {
    return this.leaveRecords.get(employeeId) || [];
  }

  createHolidayCalendar(data: Omit<HolidayCalendar, 'id' | 'createdAt'>): HolidayCalendar {
    const id = `hol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const calendar: HolidayCalendar = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };

    this.holidayCalendars.set(data.year.toString(), calendar);
    return calendar;
  }

  getHolidayCalendar(year: number): HolidayCalendar | undefined {
    return this.holidayCalendars.get(year.toString());
  }

  createLossOfPay(data: Omit<LossOfPay, 'id' | 'createdAt'>): LossOfPay {
    const id = `lop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const lop: LossOfPay = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };

    const lops = this.lossOfPayRecords.get(data.employeeId) || [];
    lops.push(lop);
    this.lossOfPayRecords.set(data.employeeId, lops);

    return lop;
  }

  getLossOfPayRecords(employeeId: string): LossOfPay[] {
    return this.lossOfPayRecords.get(employeeId) || [];
  }

  // ============================================================
  // OVERTIME
  // ============================================================

  createOvertimeRecord(data: Omit<OvertimeRecord, 'id' | 'amount' | 'createdAt'>): OvertimeRecord {
    const id = `ot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const amount = data.hours * data.rate;

    const record: OvertimeRecord = {
      ...data,
      id,
      amount,
      createdAt: new Date().toISOString(),
    };

    const records = this.overtimeRecords.get(data.employeeId) || [];
    records.push(record);
    this.overtimeRecords.set(data.employeeId, records);

    return record;
  }

  getOvertimeRecords(employeeId: string): OvertimeRecord[] {
    return this.overtimeRecords.get(employeeId) || [];
  }

  // ============================================================
  // ADVANCE
  // ============================================================

  createAdvance(data: Omit<Advance, 'id' | 'totalRecovered' | 'balanceAmount' | 'status' | 'createdAt' | 'updatedAt'>): Advance {
    const id = `adv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const advance: Advance = {
      ...data,
      id,
      totalRecovered: 0,
      balanceAmount: data.amount,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const advances = this.advances.get(data.employeeId) || [];
    advances.push(advance);
    this.advances.set(data.employeeId, advances);

    return advance;
  }

  getAdvances(employeeId: string): Advance[] {
    return this.advances.get(employeeId) || [];
  }

  updateAdvanceStatus(id: string, status: Advance['status']): void {
    for (const [employeeId, advances] of this.advances.entries()) {
      const advance = advances.find(a => a.id === id);
      if (advance) {
        advance.status = status;
        advance.updatedAt = new Date().toISOString();
        break;
      }
    }
  }

  // ============================================================
  // TRAINING
  // ============================================================

  createTraining(data: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Training {
    const id = `trn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const training: Training = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.trainings.set(id, training);
    return training;
  }

  getTraining(id: string): Training | undefined {
    return this.trainings.get(id);
  }

  getAllTrainings(): Training[] {
    return Array.from(this.trainings.values());
  }

  // ============================================================
  // PERFORMANCE
  // ============================================================

  createPerformanceReview(data: Omit<PerformanceReview, 'id' | 'createdAt' | 'updatedAt'>): PerformanceReview {
    const id = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const review: PerformanceReview = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const reviews = this.performanceReviews.get(data.employeeId) || [];
    reviews.push(review);
    this.performanceReviews.set(data.employeeId, reviews);

    return review;
  }

  getPerformanceReviews(employeeId: string): PerformanceReview[] {
    return this.performanceReviews.get(employeeId) || [];
  }

  // ============================================================
  // TRANSFER HISTORY
  // ============================================================

  createTransferHistory(data: Omit<TransferHistory, 'id' | 'createdAt'>): TransferHistory {
    const id = `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transfer: TransferHistory = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };

    const transfers = this.transferHistory.get(data.employeeId) || [];
    transfers.push(transfer);
    this.transferHistory.set(data.employeeId, transfers);

    return transfer;
  }

  getTransferHistory(employeeId: string): TransferHistory[] {
    return this.transferHistory.get(employeeId) || [];
  }

  // ============================================================
  // EXIT
  // ============================================================

  createExitRecord(data: Omit<ExitRecord, 'id' | 'createdAt' | 'updatedAt'>): ExitRecord {
    const id = `exit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const exit: ExitRecord = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const exits = this.exitRecords.get(data.employeeId) || [];
    exits.push(exit);
    this.exitRecords.set(data.employeeId, exits);

    // Update employee status
    const employee = this.employees.get(data.employeeId);
    if (employee) {
      employee.status = 'TERMINATED';
      employee.updatedAt = new Date().toISOString();
    }

    return exit;
  }

  getExitRecords(employeeId: string): ExitRecord[] {
    return this.exitRecords.get(employeeId) || [];
  }

  // ============================================================
  // LABOUR CONTRACTOR
  // ============================================================

  createLabourContractor(data: Omit<LabourContractor, 'id' | 'createdAt' | 'updatedAt'>): LabourContractor {
    const id = `lc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const contractor: LabourContractor = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.labourContractors.set(id, contractor);
    return contractor;
  }

  getLabourContractor(id: string): LabourContractor | undefined {
    return this.labourContractors.get(id);
  }

  getAllLabourContractors(): LabourContractor[] {
    return Array.from(this.labourContractors.values());
  }

  // ============================================================
  // PROJECT MANPOWER
  // ============================================================

  createProjectManpower(data: Omit<ProjectManpower, 'id'>): ProjectManpower {
    const id = `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const manpower: ProjectManpower = {
      ...data,
      id,
    };

    const manpowers = this.projectManpower.get(data.projectId) || [];
    manpowers.push(manpower);
    this.projectManpower.set(data.projectId, manpowers);

    return manpower;
  }

  getProjectManpower(projectId: string): ProjectManpower[] {
    return this.projectManpower.get(projectId) || [];
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getHRDashboardKPIs(companyId: string) {
    const employees = Array.from(this.employees.values());
    const allLabour = Array.from(this.labour.values());
    
    const activeEmployees = employees.filter((e: Employee) => e.status === 'ACTIVE');
    const siteEmployees = employees.filter((e: Employee) => e.site);
    const labourCount = allLabour.filter((l: Labour) => l.status === 'ACTIVE').length;
    const staffCount = activeEmployees.length;

    // Calculate today's attendance
    const today = new Date().toISOString().split('T')[0];
    let attendanceToday = 0;
    employees.forEach((emp: Employee) => {
      const records = this.getAttendanceRecords(emp.id);
      const todayRecord = records.find(r => r.date === today);
      if (todayRecord && todayRecord.status === 'PRESENT') {
        attendanceToday++;
      }
    });

    const attendancePercentage = activeEmployees.length > 0 
      ? (attendanceToday / activeEmployees.length) * 100 
      : 0;

    // Calculate overtime hours
    let overtimeHours = 0;
    employees.forEach((emp: Employee) => {
      const records = this.getOvertimeRecords(emp.id);
      overtimeHours += records.reduce((sum, r) => sum + r.hours, 0);
    });

    // Calculate payroll processed
    let payrollProcessed = 0;
    employees.forEach((emp: Employee) => {
      const payrolls = this.getPayroll(emp.id);
      payrollProcessed += payrolls.filter(p => p.status === 'PAID').length;
    });

    // Calculate labour cost
    let labourCost = 0;
    employees.forEach((emp: Employee) => {
      const salary = this.getCurrentSalary(emp.id);
      if (salary) {
        labourCost += salary.netSalary;
      }
    });

    // Calculate new joiners (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newJoiners = employees.filter((e: Employee) => new Date(e.joiningDate) >= thirtyDaysAgo).length;

    // Calculate exits (last 30 days)
    let exits = 0;
    employees.forEach((emp: Employee) => {
      const exits_ = this.getExitRecords(emp.id);
      exits += exits_.filter((e: ExitRecord) => new Date(e.exitDate) >= thirtyDaysAgo).length;
    });

    // Calculate training scheduled
    const trainings = this.getAllTrainings();
    const trainingScheduled = trainings.filter(t => t.status === 'SCHEDULED').length;

    // Calculate document expiring (next 30 days)
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    let documentExpiring = 0;
    employees.forEach((emp: Employee) => {
      emp.documents.forEach((doc: EmployeeDocument) => {
        if (doc.expiryDate) {
          const expiryDate = new Date(doc.expiryDate);
          if (expiryDate <= thirtyDaysLater && expiryDate >= new Date()) {
            documentExpiring++;
          }
        }
      });
    });

    return {
      totalManpower: activeEmployees.length + labourCount,
      siteManpower: siteEmployees.length,
      labourCount,
      staffCount,
      attendanceToday,
      attendancePercentage,
      overtimeHours,
      payrollProcessed,
      labourCost,
      newJoiners,
      exits,
      trainingScheduled,
      documentExpiring,
    };
  }
}

export const hrService = HRService.getInstance();
