// ============================================================
// BUILDCORE ERP - HR & PAYROLL SERVICE
// Part 25: HR / Employee / Labour / Payroll Management
// ============================================================

import type {
  Employee, EmploymentHistory, Labour, SalaryStructure, Payroll,
  AttendanceRecord, LeaveType, LeaveRecord, HolidayCalendar, LeaveOnlop,
  OvertimeRecord, Advance, Training, PerformanceReview, TransferHistory,
  ExitRecord, LabourContractor, ProjectManpower, HRDashboardKPIs
} from '../types/hr';

export class HRService {
  private static instance: HRService;
  
  private employees: Map<string, Employee> = new Map();
  private employmentHistory: Map<string, EmploymentHistory[]> = new Map();
  private labour: Map<string, Labour> = new Map();
  private salaryStructures: Map<string, SalaryStructure[]> = new Map();
  private payrolls: Map<string, Payroll[]> = new Map();
  private attendanceRecords: Map<string, AttendanceRecord[]> = new Map();
  private leaveTypes: Map<string, LeaveType[]> = new Map();
  private leaveRecords: Map<string, LeaveRecord[]> = new Map();
  private holidayCalendars: Map<string, HolidayCalendar[]> = new Map();
  private leaveOnlops: Map<string, LeaveOnlop[]> = new Map();
  private overtimeRecords: Map<string, OvertimeRecord[]> = new Map();
  private advances: Map<string, Advance[]> = new Map();
  private trainings: Map<string, Training[]> = new Map();
  private performanceReviews: Map<string, PerformanceReview[]> = new Map();
  private transferHistory: Map<string, TransferHistory[]> = new Map();
  private exitRecords: Map<string, ExitRecord[]> = new Map();
  private labourContractors: Map<string, LabourContractor[]> = new Map();
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

  createEmployee( Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Employee {
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
        id: '',
        employeeId: id,
        eventType: 'JOINING',
        eventDate: data.joiningDate,
        newValue: { employeeId: id, projectId: data.projectId, siteId: data.siteId },
        createdBy: 'system',
        createdAt: new Date().toISOString(),
    });

    return employee;
  }

  getEmployee(id: string): Employee | undefined {
    return this.employees.get(id);
  }

  getEmployeesByCompany(companyId: string): Employee[] {
    return Array.from(this.employees.values()).filter(e => e.companyId === companyId);
  }

  getEmployeesByProject(projectId: string): Employee[] {
    return Array.from(this.employees.values()).filter(e => e.projectId === projectId);
  }

  getEmployeesBySite(siteId: string): Employee[] {
    return Array.from(this.employees.values()).filter(e => e.siteId === siteId);
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

  addEmploymentHistory( Omit<EmploymentHistory, 'id' | 'createdAt'>): EmploymentHistory {
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

  createLabour( Omit<Labour, 'id' | 'createdAt' | 'updatedAt'>): Labour {
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

  getLabourByCompany(companyId: string): Labour[] {
    return Array.from(this.labour.values()).filter(l => l.companyId === companyId);
  }

  getLabourByProject(projectId: string): Labour[] {
    return Array.from(this.labour.values()).filter(l => l.projectId === projectId);
  }

  getLabourBySite(siteId: string): Labour[] {
    return Array.from(this.labour.values()).filter(l => l.siteId === siteId);
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

  createSalaryStructure( Omit<SalaryStructure, 'id' | 'grossSalary' | 'netSalary' | 'createdAt' | 'updatedAt'>): SalaryStructure {
    const id = `sal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate gross salary
    const allowancesTotal = data.allowances.reduce((sum, a) => sum + a.amount, 0);
    const grossSalary = data.basic + data.hra + allowancesTotal + 
      (data.siteAllowance || 0) + (data.foodAllowance || 0) + 
      (data.travelAllowance || 0) + (data.bonus || 0) + (data.incentive || 0);

    // Calculate net salary
    const deductionsTotal = data.deductions.reduce((sum, d) => sum + d.amount, 0);
    const netSalary = grossSalary - deductionsTotal - (data.advanceRecovery || 0);

    const structure: SalaryStructure = {
      ...data,
      id,
      grossSalary,
      netSalary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const structures = this.salaryStructures.get(data.employeeId) || [];
    structures.push(structure);
    this.salaryStructures.set(data.employeeId, structures);

    return structure;
  }

  getSalaryStructures(employeeId: string): SalaryStructure[] {
    return this.salaryStructures.get(employeeId) || [];
  }

  getCurrentSalaryStructure(employeeId: string): SalaryStructure | undefined {
    const structures = this.salaryStructures.get(employeeId) || [];
    const now = new Date().toISOString();
    return structures.find(s => 
      s.effectiveFrom <= now && (!s.effectiveTo || s.effectiveTo > now)
    );
  }

  // ============================================================
  // PAYROLL
  // ============================================================

  createPayroll( Omit<Payroll, 'id' | 'grossSalary' | 'netSalary' | 'status' | 'payslipGenerated' | 'createdAt' | 'updatedAt'>): Payroll {
    const id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get current salary structure
    const salaryStructure = this.getCurrentSalaryStructure(data.employeeId);
    if (!salaryStructure) {
      throw new Error('No active salary structure found for employee');
    }

    // Calculate gross salary with overtime
    const overtimeTotal = data.overtime.reduce((sum, ot) => sum + ot.amount, 0);
    const grossSalary = salaryStructure.grossSalary + overtimeTotal;

    // Calculate net salary
    const deductionsTotal = data.deductions.reduce((sum, d) => sum + d.amount, 0);
    const netSalary = grossSalary - deductionsTotal;

    const payroll: Payroll = {
      ...data,
      id,
      grossSalary,
      netSalary,
      status: 'DRAFT',
      payslipGenerated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const payrolls = this.payrolls.get(data.employeeId) || [];
    payrolls.push(payroll);
    this.payrolls.set(data.employeeId, payrolls);

    return payroll;
  }

  getPayrolls(employeeId: string): Payroll[] {
    return this.payrolls.get(employeeId) || [];
  }

  getPayrollByPeriod(employeeId: string, period: string): Payroll | undefined {
    const payrolls = this.payrolls.get(employeeId) || [];
    return payrolls.find(p => p.payrollPeriod === period);
  }

  updatePayrollStatus(id: string, status: Payroll['status'], approvedBy?: string): void {
    for (const [employeeId, payrolls] of this.payrolls.entries()) {
      const payroll = payrolls.find(p => p.id === id);
      if (payroll) {
        payroll.status = status;
        payroll.updatedAt = new Date().toISOString();
        
        if (status === 'APPROVED' && approvedBy) {
          payroll.approvedBy = approvedBy;
          payroll.approvedAt = new Date().toISOString();
        }
        
        if (status === 'POSTED') {
          payroll.postedAt = new Date().toISOString();
        }
        
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

  createAttendanceRecord( Omit<AttendanceRecord, 'id' | 'hoursWorked' | 'createdAt'>): AttendanceRecord {
    const id = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate hours worked
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

  getAttendanceRecords(employeeId: string, startDate?: string, endDate?: string): AttendanceRecord[] {
    let records = this.attendanceRecords.get(employeeId) || [];
    
    if (startDate) {
      records = records.filter(r => r.date >= startDate);
    }
    if (endDate) {
      records = records.filter(r => r.date <= endDate);
    }
    
    return records;
  }

  // ============================================================
  // LEAVE MANAGEMENT
  // ============================================================

  createLeaveType( Omit<LeaveType, 'id' | 'createdAt' | 'updatedAt'>): LeaveType {
    const id = `lt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const leaveType: LeaveType = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const types = this.leaveTypes.get(data.companyId) || [];
    types.push(leaveType);
    this.leaveTypes.set(data.companyId, types);

    return leaveType;
  }

  getLeaveTypes(companyId: string): LeaveType[] {
    return this.leaveTypes.get(companyId) || [];
  }

  createLeaveRecord( Omit<LeaveRecord, 'id' | 'days' | 'createdAt' | 'updatedAt'>): LeaveRecord {
    const id = `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate days
    const fromDate = new Date(data.fromDate);
    const toDate = new Date(data.toDate);
    const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const record: LeaveRecord = {
      ...data,
      id,
      days,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const records = this.leaveRecords.get(data.employeeId) || [];
    records.push(record);
    this.leaveRecords.set(data.employeeId, records);

    return record;
  }

  getLeaveRecords(employeeId: string): LeaveRecord[] {
    return this.leaveRecords.get(employeeId) || [];
  }

  updateLeaveStatus(id: string, status: LeaveRecord['status'], approvedBy?: string): void {
    for (const [employeeId, records] of this.leaveRecords.entries()) {
      const record = records.find(r => r.id === id);
      if (record) {
        record.status = status;
        record.updatedAt = new Date().toISOString();
        
        if (status === 'APPROVED' && approvedBy) {
          record.approvedBy = approvedBy;
          record.approvedAt = new Date().toISOString();
        }
        
        break;
      }
    }
  }

  createHolidayCalendar( Omit<HolidayCalendar, 'id' | 'createdAt'>): HolidayCalendar {
    const id = `hol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const holiday: HolidayCalendar = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };

    const holidays = this.holidayCalendars.get(data.companyId) || [];
    holidays.push(holiday);
    this.holidayCalendars.set(data.companyId, holidays);

    return holiday;
  }

  getHolidayCalendar(companyId: string, year?: string): HolidayCalendar[] {
    let holidays = this.holidayCalendars.get(companyId) || [];
    
    if (year) {
      holidays = holidays.filter(h => h.date.startsWith(year));
    }
    
    return holidays;
  }

  createLeaveOnlop( Omit<LeaveOnlop, 'id' | 'createdAt'>): LeaveOnlop {
    const id = `lop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const lop: LeaveOnlop = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };

    const lops = this.leaveOnlops.get(data.employeeId) || [];
    lops.push(lop);
    this.leaveOnlops.set(data.employeeId, lops);

    return lop;
  }

  getLeaveOnlops(employeeId: string): LeaveOnlop[] {
    return this.leaveOnlops.get(employeeId) || [];
  }

  // ============================================================
  // OVERTIME
  // ============================================================

  createOvertimeRecord( Omit<OvertimeRecord, 'id' | 'amount' | 'createdAt'>): OvertimeRecord {
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

  getOvertimeRecords(employeeId: string, startDate?: string, endDate?: string): OvertimeRecord[] {
    let records = this.overtimeRecords.get(employeeId) || [];
    
    if (startDate) {
      records = records.filter(r => r.date >= startDate);
    }
    if (endDate) {
      records = records.filter(r => r.date <= endDate);
    }
    
    return records;
  }

  // ============================================================
  // ADVANCE
  // ============================================================

  createAdvance( Omit<Advance, 'id' | 'recoveredAmount' | 'status' | 'createdAt' | 'updatedAt'>): Advance {
    const id = `adv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const advance: Advance = {
      ...data,
      id,
      recoveredAmount: 0,
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

  updateAdvanceStatus(id: string, status: Advance['status'], approvedBy?: string): void {
    for (const [employeeId, advances] of this.advances.entries()) {
      const advance = advances.find(a => a.id === id);
      if (advance) {
        advance.status = status;
        advance.updatedAt = new Date().toISOString();
        
        if (status === 'APPROVED' && approvedBy) {
          advance.approvedBy = approvedBy;
          advance.approvedAt = new Date().toISOString();
        }
        
        if (status === 'PAID') {
          advance.paidAt = new Date().toISOString();
          advance.status = 'RECOVERING';
        }
        
        if (status === 'SETTLED') {
          advance.settledAt = new Date().toISOString();
        }
        
        break;
      }
    }
  }

  // ============================================================
  // TRAINING
  // ============================================================

  createTraining( Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Training {
    const id = `trn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const training: Training = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const trainings = this.trainings.get(data.companyId) || [];
    trainings.push(training);
    this.trainings.set(data.companyId, trainings);

    return training;
  }

  getTrainings(companyId: string): Training[] {
    return this.trainings.get(companyId) || [];
  }

  // ============================================================
  // PERFORMANCE
  // ============================================================

  createPerformanceReview( Omit<PerformanceReview, 'id' | 'createdAt' | 'updatedAt'>): PerformanceReview {
    const id = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const review: PerformanceReview = {
      ...data,
      id,
      status: 'DRAFT',
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

  createTransferHistory( Omit<TransferHistory, 'id' | 'createdAt'>): TransferHistory {
    const id = `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transfer: TransferHistory = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };

    const histories = this.transferHistory.get(data.employeeId) || [];
    histories.push(transfer);
    this.transferHistory.set(data.employeeId, histories);

    return transfer;
  }

  getTransferHistory(employeeId: string): TransferHistory[] {
    return this.transferHistory.get(employeeId) || [];
  }

  // ============================================================
  // EXIT
  // ============================================================

  createExitRecord( Omit<ExitRecord, 'id' | 'createdAt' | 'updatedAt'>): ExitRecord {
    const id = `exit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const exit: ExitRecord = {
      ...data,
      id,
      status: 'INITIATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const exits = this.exitRecords.get(data.employeeId) || [];
    exits.push(exit);
    this.exitRecords.set(data.employeeId, exits);

    return exit;
  }

  getExitRecords(employeeId: string): ExitRecord[] {
    return this.exitRecords.get(employeeId) || [];
  }

  // ============================================================
  // LABOUR CONTRACTOR
  // ============================================================

  createLabourContractor( Omit<LabourContractor, 'id' | 'createdAt' | 'updatedAt'>): LabourContractor {
    const id = `lc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const contractor: LabourContractor = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const contractors = this.labourContractors.get(data.companyId) || [];
    contractors.push(contractor);
    this.labourContractors.set(data.companyId, contractors);

    return contractor;
  }

  getLabourContractors(companyId: string): LabourContractor[] {
    return this.labourContractors.get(companyId) || [];
  }

  // ============================================================
  // PROJECT MANPOWER
  // ============================================================

  createProjectManpower( Omit<ProjectManpower, 'id' | 'totalLabour' | 'totalManpower' | 'createdAt'>): ProjectManpower {
    const id = `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const totalLabour = data.skilledLabour + data.semiSkilledLabour + data.unskilledLabour;
    const totalManpower = totalLabour + data.staffCount;

    const manpower: ProjectManpower = {
      ...data,
      id,
      totalLabour,
      totalManpower,
      createdAt: new Date().toISOString(),
    };

    const manpowers = this.projectManpower.get(data.projectId) || [];
    manpowers.push(manpower);
    this.projectManpower.set(data.projectId, manpowers);

    return manpower;
  }

  getProjectManpower(projectId: string, date?: string): ProjectManpower[] {
    let manpowers = this.projectManpower.get(projectId) || [];
    
    if (date) {
      manpowers = manpowers.filter(m => m.date === date);
    }
    
    return manpowers;
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getHRDashboardKPIs(companyId: string): CompanyDashboardKPIs {
    const employees = this.getEmployeesByCompany(companyId);
    const labourList = this.getLabourByCompany(companyId);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Count attendance for today
    let presentToday = 0;
    let absentToday = 0;
    let onLeave = 0;
    
    employees.forEach(emp => {
      const attendance = this.getAttendanceRecords(emp.id, today, today);
      if (attendance.length > 0) {
        const todayRecord = attendance[0];
        if (todayRecord.status === 'PRESENT') presentToday++;
        else if (todayRecord.status === 'ABSENT') absentToday++;
        else if (todayRecord.status === 'LEAVE') onLeave++;
      }
    });

    // Calculate overtime hours for current month
    const currentMonth = new Date().toISOString().substring(0, 7);
    let overtimeHours = 0;
    employees.forEach(emp => {
      const overtime = this.getOvertimeRecords(emp, `${currentMonth}-01`, `${currentMonth}-31`);
      overtimeHours += overtime.reduce((sum, ot) => sum + ot.hours, 0);
    });

    // Calculate total payroll for current month
    let totalPayroll = 0;
    employees.forEach(emp => {
      const payroll = this.getPayrolls(emp).find(p => p.payrollPeriod === currentMonth);
      if (payroll) {
        totalPayroll += payroll.netSalary;
      }
    });

    // Calculate labour cost
    let labourCost = 0;
    labourList.forEach(lab => {
      if (lab.wageMode === 'DAILY') {
        labourCost += lab.wageRate * 26; // Assuming 26 working days
      } else if (lab.wageMode === 'MONTHLY') {
        labourCost += lab.wageRate;
      }
    });

    // Count new joiners (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newJoiners = employees.filter(e => new Date(e.joiningDate) > thirtyDaysAgo).length;

    // Count exits (last 30 days)
    let exits = 0;
    employees.forEach(emp => {
      const exits = this.getExitRecords(emp.id);
      exits.forEach(exit => {
        if (new Date(exit.exitDate) > thirtyDaysAgo) {
          exits++;
        }
      });
    });

    // Count training completed (last 30 days)
    const trainings = this.getTrainings(companyId);
    const trainingCompleted = trainings.filter(t => 
      t.status === 'COMPLETED' && new Date(t.date) > thirtyDaysAgo
    ).length;

    // Count document expiry (next 30 days)
    let documentExpiry = 0;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    employees.forEach(emp => {
      emp.documents.forEach(doc => {
        if (doc.expiryDate) {
          const expiry = new Date(doc.expiryDate);
          if (expiry > new Date() && expiry <= thirtyDaysFromNow) {
            documentExpiry++;
          }
        }
      });
    });

    return {
      totalManpower: employees.length + labourList.length,
      siteManpower: employees.filter(e => e.siteId).length + labourList.length,
      labourCount: labourList.length,
      staffCount: employees.length,
      presentToday,
      absentToday,
      onLeave,
      overtimeHours,
      totalPayroll,
      labourCost,
      newJoiners,
      exits,
      trainingCompleted,
      documentExpiry,
    };
  }
}

export const hrService = HRService.getInstance();
