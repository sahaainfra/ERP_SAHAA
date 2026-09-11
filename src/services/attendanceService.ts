// ============================================================
// BUILDCORE ERP - GEO-FENCED ATTENDANCE SERVICE
// Part 26: Geo-Fenced Attendance / Site Manpower
// ============================================================

import type {
  GeoFence,
  GeoFencedAttendanceRecord,
  ClockRecord,
  AntiProxyAlert,
  Shift,
  AttendanceCorrection,
  ManpowerPlan,
  ProductivityRecord,
  AttendanceDashboardKPIs,
  GeoStatus,
  GeoFencedAttendanceStatus
} from '../types/attendance';

export class AttendanceService {
  private static instance: AttendanceService;
  
  private geoFences: Map<string, GeoFence> = new Map();
  private attendanceRecords: Map<string, GeoFencedAttendanceRecord> = new Map();
  private antiProxyAlerts: Map<string, AntiProxyAlert> = new Map();
  private shifts: Map<string, Shift> = new Map();
  private corrections: Map<string, AttendanceCorrection> = new Map();
  private manpowerPlans: Map<string, ManpowerPlan> = new Map();
  private productivityRecords: Map<string, ProductivityRecord> = new Map();

  private constructor() {}

  static getInstance(): AttendanceService {
    if (!AttendanceService.instance) {
      AttendanceService.instance = new AttendanceService();
    }
    return AttendanceService.instance;
  }

  // ============================================================
  // GEO-FENCE MANAGEMENT
  // ============================================================

  createGeoFence(data: {
    projectId: string;
    siteId: string;
    latitude: number;
    longitude: number;
    radius: number;
    effectiveDate: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdBy: string;
  }): GeoFence {
    const geoFence: GeoFence = {
      ...data,
      id: `gf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.geoFences.set(geoFence.id, geoFence);
    this.logAudit('GEOFENCE_CREATED', `Geo-fence created for site ${data.siteId}`, data.createdBy);

    return geoFence;
  }

  getGeoFenceBySite(siteId: string): GeoFence | undefined {
    return Array.from(this.geoFences.values()).find(gf => gf.siteId === siteId && gf.status === 'ACTIVE');
  }

  updateGeoFence(id: string, updates: Partial<GeoFence>, updatedBy: string): GeoFence | null {
    const geoFence = this.geoFences.get(id);
    if (!geoFence) return null;

    const updated = { ...geoFence, ...updates, updatedAt: new Date().toISOString() };
    this.geoFences.set(id, updated);
    this.logAudit('GEOFENCE_UPDATED', `Geo-fence updated for site ${geoFence.siteId}`, updatedBy);

    return updated;
  }

  // ============================================================
  // CLOCK IN/OUT
  // ============================================================

  clockIn(data: {
    employeeId: string;
    date: string;
    clockIn: ClockRecord;
    shiftId?: string;
    projectId: string;
    siteId: string;
  }): GeoFencedAttendanceRecord {
    const geoFence = this.getGeoFenceBySite(data.siteId);
    const geoStatus = this.validateGeoLocation(data.clockIn, geoFence);

    const record: GeoFencedAttendanceRecord = {
      ...data,
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'PRESENT',
      geoStatus,
      isCorrected: false,
      syncStatus: 'SYNCED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.attendanceRecords.set(record.id, record);
    this.checkAntiProxyAlerts(record);

    return record;
  }

  clockOut(recordId: string, clockOut: ClockRecord): GeoFencedAttendanceRecord | null {
    const record = this.attendanceRecords.get(recordId);
    if (!record) return null;

    const geoFence = this.getGeoFenceBySite(record.siteId);
    const geoStatus = this.validateGeoLocation(clockOut, geoFence);

    record.clockOut = { ...clockOut, geoStatus };
    
    if (record.clockIn) {
      const clockInTime = new Date(record.clockIn.time).getTime();
      const clockOutTime = new Date(clockOut.time).getTime();
      const workingHours = (clockOutTime - clockInTime) / (1000 * 60 * 60);
      
      record.workingHours = Math.max(0, workingHours);
      
      const shift = this.shifts.get(record.shiftId || '');
      if (shift) {
        const shiftStart = this.timeToMinutes(shift.startTime);
        const shiftEnd = this.timeToMinutes(shift.endTime);
        const shiftDuration = shiftEnd - shiftStart;
        const actualHours = workingHours * 60;
        
        if (actualHours > shiftDuration + shift.overtimeThreshold) {
          record.overtimeHours = (actualHours - shiftDuration) / 60;
        }
      }
    }

    record.updatedAt = new Date().toISOString();
    this.checkAntiProxyAlerts(record);

    return record;
  }

  private validateGeoLocation(clock: ClockRecord, geoFence?: GeoFence): GeoStatus {
    if (!geoFence) return 'GPS_UNAVAILABLE';
    
    if (clock.latitude === 0 && clock.longitude === 0) {
      return 'GPS_UNAVAILABLE';
    }

    if (clock.accuracy > 100) {
      return 'LOW_ACCURACY';
    }

    const distance = this.calculateDistance(
      clock.latitude,
      clock.longitude,
      geoFence.latitude,
      geoFence.longitude
    );

    if (distance <= geoFence.radius) {
      return 'VALID';
    }

    return 'OUTSIDE';
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // ============================================================
  // ANTI-PROXY DETECTION
  // ============================================================

  private checkAntiProxyAlerts(record: GeoFencedAttendanceRecord): void {
    if (record.clockIn) {
      const sameDeviceRecords = Array.from(this.attendanceRecords.values()).filter(r => 
        r.date === record.date &&
        r.clockIn?.deviceId === record.clockIn?.deviceId &&
        r.employeeId !== record.employeeId
      );

      if (sameDeviceRecords.length > 0) {
        this.createAntiProxyAlert({
          alertType: 'SAME_DEVICE_MULTIPLE_EMPLOYEES',
          employeeId: record.employeeId,
          date: record.date,
          details: `Same device used by multiple employees on ${record.date}`,
          severity: 'HIGH',
          status: 'PENDING_REVIEW',
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (record.clockIn && record.clockOut) {
      const previousRecord = Array.from(this.attendanceRecords.values()).find(r => 
        r.employeeId === record.employeeId &&
        r.date < record.date &&
        r.clockOut
      );

      if (previousRecord && previousRecord.clockOut) {
        const distance = this.calculateDistance(
          previousRecord.clockOut.latitude,
          previousRecord.clockOut.longitude,
          record.clockIn.latitude,
          record.clockIn.longitude
        );

        const timeDiff = new Date(record.clockIn.time).getTime() - 
                        new Date(previousRecord.clockOut.time).getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (distance > 100000 && hoursDiff < 2) {
          this.createAntiProxyAlert({
            alertType: 'IMPOSSIBLE_TRAVEL',
            employeeId: record.employeeId,
            date: record.date,
            details: `Impossible travel detected: ${Math.round(distance / 1000)}km in ${Math.round(hoursDiff)} hours`,
            severity: 'HIGH',
            status: 'PENDING_REVIEW',
            createdAt: new Date().toISOString(),
          });
        }
      }
    }
  }

  private createAntiProxyAlert(data: {
    alertType: 'SAME_DEVICE_MULTIPLE_EMPLOYEES' | 'IMPOSSIBLE_TRAVEL' | 'REPEATED_LOCATION' | 'DUPLICATE_PUNCH' | 'SUSPICIOUS_GPS' | 'EXCESSIVE_MANUAL_CORRECTION';
    employeeId: string;
    date: string;
    details: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'PENDING_REVIEW' | 'REVIEWED' | 'DISMISSED';
    createdAt: string;
  }): AntiProxyAlert {
    const alert: AntiProxyAlert = {
      ...data,
      id: `apa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    this.antiProxyAlerts.set(alert.id, alert);
    return alert;
  }

  // ============================================================
  // SHIFT MANAGEMENT
  // ============================================================

  createShift(data: {
    projectId: string;
    siteId: string;
    shiftName: string;
    shiftType: 'DAY' | 'NIGHT' | 'ROTATIONAL' | 'CUSTOM';
    startTime: string;
    endTime: string;
    breakStartTime?: string;
    breakEndTime?: string;
    gracePeriod: number;
    overtimeThreshold: number;
    isActive: boolean;
  }): Shift {
    const shift: Shift = {
      ...data,
      id: `shift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.shifts.set(shift.id, shift);
    return shift;
  }

  getShiftsBySite(siteId: string): Shift[] {
    return Array.from(this.shifts.values()).filter(s => s.siteId === siteId && s.isActive);
  }

  // ============================================================
  // ATTENDANCE CORRECTION
  // ============================================================

  requestCorrection(data: {
    attendanceId: string;
    employeeId: string;
    correctionType: 'CLOCK_IN' | 'CLOCK_OUT' | 'BOTH';
    originalClockIn?: string;
    originalClockOut?: string;
    requestedClockIn?: string;
    requestedClockOut?: string;
    reason: string;
  }): AttendanceCorrection {
    const correction: AttendanceCorrection = {
      ...data,
      id: `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'SUBMITTED',
      workflow: [
        { level: 'SUPERVISOR', approverId: '', status: 'PENDING' },
        { level: 'PROJECT_AUTHORITY', approverId: '', status: 'PENDING' },
        { level: 'HR', approverId: '', status: 'PENDING' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.corrections.set(correction.id, correction);
    return correction;
  }

  approveCorrection(correctionId: string, level: 'SUPERVISOR' | 'PROJECT_AUTHORITY' | 'HR', approverId: string, comments?: string): AttendanceCorrection | null {
    const correction = this.corrections.get(correctionId);
    if (!correction) return null;

    const workflowItem = correction.workflow.find(w => w.level === level);
    if (workflowItem) {
      workflowItem.approverId = approverId;
      workflowItem.status = 'APPROVED';
      workflowItem.approvedAt = new Date().toISOString();
      workflowItem.comments = comments;

      const allApproved = correction.workflow.every(w => w.status === 'APPROVED');
      if (allApproved) {
        correction.status = 'HR_APPROVED';
        
        const record = this.attendanceRecords.get(correction.attendanceId);
        if (record) {
          record.originalRecord = JSON.stringify({
            clockIn: record.clockIn,
            clockOut: record.clockOut,
          });
          
          if (correction.correctionType === 'CLOCK_IN' || correction.correctionType === 'BOTH') {
            if (correction.requestedClockIn) {
              record.clockIn = { ...record.clockIn!, time: correction.requestedClockIn };
            }
          }
          
          if (correction.correctionType === 'CLOCK_OUT' || correction.correctionType === 'BOTH') {
            if (correction.requestedClockOut) {
              record.clockOut = { ...record.clockOut!, time: correction.requestedClockOut };
            }
          }
          
          record.isCorrected = true;
          record.updatedAt = new Date().toISOString();
        }
      }

      correction.updatedAt = new Date().toISOString();
    }

    return correction;
  }

  // ============================================================
  // MANPOWER PLANNING
  // ============================================================

  createManpowerPlan(data: {
    projectId: string;
    siteId: string;
    date: string;
    plannedManpower: Array<{
      trade: string;
      required: number;
      skillLevel: 'UNSKILLED' | 'SEMI_SKILLED' | 'SKILLED' | 'HIGHLY_SKILLED';
    }>;
    actualManpower: Array<{
      trade: string;
      present: number;
      absent: number;
      onLeave: number;
    }>;
  }): ManpowerPlan {
    const shortage = data.plannedManpower.reduce((sum, req) => {
      const actual = data.actualManpower.find(a => a.trade === req.trade);
      const actualCount = actual ? actual.present : 0;
      return sum + Math.max(0, req.required - actualCount);
    }, 0);

    const surplus = data.plannedManpower.reduce((sum, req) => {
      const actual = data.actualManpower.find(a => a.trade === req.trade);
      const actualCount = actual ? actual.present : 0;
      return sum + Math.max(0, actualCount - req.required);
    }, 0);

    const plan: ManpowerPlan = {
      ...data,
      id: `mp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      shortage,
      surplus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.manpowerPlans.set(plan.id, plan);
    return plan;
  }

  getManpowerPlansBySite(siteId: string, date: string): ManpowerPlan[] {
    return Array.from(this.manpowerPlans.values()).filter(
      p => p.siteId === siteId && p.date === date
    );
  }

  // ============================================================
  // PRODUCTIVITY
  // ============================================================

  recordProductivity(data: {
    employeeId: string;
    date: string;
    trade: string;
    manHours: number;
    quantityExecuted: number;
    unit: string;
    projectId: string;
    siteId: string;
  }): ProductivityRecord {
    const productivity = data.manHours > 0 ? data.quantityExecuted / data.manHours : 0;

    const record: ProductivityRecord = {
      ...data,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productivity,
      createdAt: new Date().toISOString(),
    };

    this.productivityRecords.set(record.id, record);
    return record;
  }

  getProductivityByEmployee(employeeId: string, date: string): ProductivityRecord[] {
    return Array.from(this.productivityRecords.values()).filter(
      r => r.employeeId === employeeId && r.date === date
    );
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getAttendanceDashboardKPIs(projectId: string, date: string): AttendanceDashboardKPIs {
    const records = Array.from(this.attendanceRecords.values()).filter(
      r => r.projectId === projectId && r.date === date
    );

    const present = records.filter(r => r.status === 'PRESENT').length;
    const absent = records.filter(r => r.status === 'ABSENT').length;
    const late = records.filter(r => r.status === 'LATE').length;
    const early = records.filter(r => r.status === 'EARLY').length;
    const overtime = records.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
    const missingPunch = records.filter(r => r.status === 'MISSING_PUNCH').length;
    const outsideGeofence = records.filter(r => r.geoStatus === 'OUTSIDE').length;
    const correctionPending = Array.from(this.corrections.values()).filter(
      c => c.status === 'SUBMITTED'
    ).length;

    const siteMap = new Map<string, { present: number; absent: number; total: number }>();
    records.forEach(r => {
      const site = siteMap.get(r.siteId) || { present: 0, absent: 0, total: 0 };
      site.total++;
      if (r.status === 'PRESENT' || r.status === 'LATE' || r.status === 'EARLY') {
        site.present++;
      } else if (r.status === 'ABSENT') {
        site.absent++;
      }
      siteMap.set(r.siteId, site);
    });

    const siteWiseManpower = Array.from(siteMap.entries()).map(([siteId, data]) => ({
      siteId,
      siteName: `Site ${siteId}`,
      ...data,
    }));

    const tradeWiseManpower = [
      { trade: 'Mason', present: 15, absent: 2, total: 17 },
      { trade: 'Helper', present: 25, absent: 3, total: 28 },
      { trade: 'Bar Bender', present: 8, absent: 1, total: 9 },
    ];

    return {
      present,
      absent,
      late,
      early,
      overtime,
      missingPunch,
      outsideGeofence,
      correctionPending,
      siteWiseManpower,
      tradeWiseManpower,
    };
  }

  // ============================================================
  // AUDIT LOGGING
  // ============================================================

  private logAudit(action: string, details: string, userId: string): void {
    console.log(`[AUDIT] ${action}: ${details} by ${userId}`);
  }

  // ============================================================
  // GETTERS
  // ============================================================

  getAttendanceRecord(id: string): GeoFencedAttendanceRecord | undefined {
    return this.attendanceRecords.get(id);
  }

  getAttendanceByEmployee(employeeId: string, date: string): GeoFencedAttendanceRecord | undefined {
    return Array.from(this.attendanceRecords.values()).find(
      r => r.employeeId === employeeId && r.date === date
    );
  }

  getAttendanceByDateRange(projectId: string, startDate: string, endDate: string): GeoFencedAttendanceRecord[] {
    return Array.from(this.attendanceRecords.values()).filter(
      r => r.projectId === projectId && r.date >= startDate && r.date <= endDate
    );
  }
}

export const attendanceService = AttendanceService.getInstance();
