// ============================================================
// BUILDCORE ERP - ATTENDANCE STORE
// Part 26: Geo-Fenced Attendance / Site Manpower
// ============================================================

import { create } from 'zustand';
import type {
  GeoFence,
  GeoFencedAttendanceRecord,
  ClockRecord,
  Shift,
  AttendanceCorrection,
  ManpowerPlan,
  ProductivityRecord,
  AttendanceDashboardKPIs
} from '../types/attendance';
import { attendanceService } from '../services/attendanceService';

interface AttendanceState {
  // Data
  geoFences: Map<string, GeoFence>;
  attendanceRecords: Map<string, GeoFencedAttendanceRecord>;
  shifts: Map<string, Shift>;
  corrections: Map<string, AttendanceCorrection>;
  manpowerPlans: Map<string, ManpowerPlan>;
  productivityRecords: Map<string, ProductivityRecord>;
  dashboardKPIs: AttendanceDashboardKPIs | null;
  
  // Actions
  createGeoFence: (data: {
    projectId: string;
    siteId: string;
    latitude: number;
    longitude: number;
    radius: number;
    effectiveDate: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdBy: string;
  }) => GeoFence;
  
  getGeoFenceBySite: (siteId: string) => GeoFence | undefined;
  
  clockIn: (data: {
    employeeId: string;
    date: string;
    clockIn: ClockRecord;
    shiftId?: string;
    projectId: string;
    siteId: string;
  }) => GeoFencedAttendanceRecord;
  
  clockOut: (recordId: string, clockOut: ClockRecord) => GeoFencedAttendanceRecord | null;
  
  createShift: (data: {
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
  }) => Shift;
  
  getShiftsBySite: (siteId: string) => Shift[];
  
  requestCorrection: (data: {
    attendanceId: string;
    employeeId: string;
    correctionType: 'CLOCK_IN' | 'CLOCK_OUT' | 'BOTH';
    originalClockIn?: string;
    originalClockOut?: string;
    requestedClockIn?: string;
    requestedClockOut?: string;
    reason: string;
  }) => AttendanceCorrection;
  
  approveCorrection: (
    correctionId: string,
    level: 'SUPERVISOR' | 'PROJECT_AUTHORITY' | 'HR',
    approverId: string,
    comments?: string
  ) => AttendanceCorrection | null;
  
  createManpowerPlan: (data: {
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
  }) => ManpowerPlan;
  
  getManpowerPlansBySite: (siteId: string, date: string) => ManpowerPlan[];
  
  recordProductivity: (data: {
    employeeId: string;
    date: string;
    trade: string;
    manHours: number;
    quantityExecuted: number;
    unit: string;
    projectId: string;
    siteId: string;
  }) => ProductivityRecord;
  
  getProductivityByEmployee: (employeeId: string, date: string) => ProductivityRecord[];
  
  getAttendanceDashboardKPIs: (projectId: string, date: string) => AttendanceDashboardKPIs;
  
  getAttendanceRecord: (id: string) => GeoFencedAttendanceRecord | undefined;
  getAttendanceByEmployee: (employeeId: string, date: string) => GeoFencedAttendanceRecord | undefined;
  getAttendanceByDateRange: (projectId: string, startDate: string, endDate: string) => GeoFencedAttendanceRecord[];
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  geoFences: new Map(),
  attendanceRecords: new Map(),
  shifts: new Map(),
  corrections: new Map(),
  manpowerPlans: new Map(),
  productivityRecords: new Map(),
  dashboardKPIs: null,

  createGeoFence: (data) => {
    const geoFence = attendanceService.createGeoFence(data);
    set(state => ({
      geoFences: new Map(state.geoFences).set(geoFence.id, geoFence)
    }));
    return geoFence;
  },

  getGeoFenceBySite: (siteId) => {
    return attendanceService.getGeoFenceBySite(siteId);
  },

  clockIn: (data) => {
    const record = attendanceService.clockIn(data);
    set(state => ({
      attendanceRecords: new Map(state.attendanceRecords).set(record.id, record)
    }));
    return record;
  },

  clockOut: (recordId, clockOut) => {
    const record = attendanceService.clockOut(recordId, clockOut);
    if (record) {
      set(state => ({
        attendanceRecords: new Map(state.attendanceRecords).set(record.id, record)
      }));
    }
    return record;
  },

  createShift: (data) => {
    const shift = attendanceService.createShift(data);
    set(state => ({
      shifts: new Map(state.shifts).set(shift.id, shift)
    }));
    return shift;
  },

  getShiftsBySite: (siteId) => {
    return attendanceService.getShiftsBySite(siteId);
  },

  requestCorrection: (data) => {
    const correction = attendanceService.requestCorrection(data);
    set(state => ({
      corrections: new Map(state.corrections).set(correction.id, correction)
    }));
    return correction;
  },

  approveCorrection: (correctionId, level, approverId, comments) => {
    const correction = attendanceService.approveCorrection(correctionId, level, approverId, comments);
    if (correction) {
      set(state => ({
        corrections: new Map(state.corrections).set(correction.id, correction)
      }));
    }
    return correction;
  },

  createManpowerPlan: (data) => {
    const plan = attendanceService.createManpowerPlan(data);
    set(state => ({
      manpowerPlans: new Map(state.manpowerPlans).set(plan.id, plan)
    }));
    return plan;
  },

  getManpowerPlansBySite: (siteId, date) => {
    return attendanceService.getManpowerPlansBySite(siteId, date);
  },

  recordProductivity: (data) => {
    const record = attendanceService.recordProductivity(data);
    set(state => ({
      productivityRecords: new Map(state.productivityRecords).set(record.id, record)
    }));
    return record;
  },

  getProductivityByEmployee: (employeeId, date) => {
    return attendanceService.getProductivityByEmployee(employeeId, date);
  },

  getAttendanceDashboardKPIs: (projectId, date) => {
    const kpis = attendanceService.getAttendanceDashboardKPIs(projectId, date);
    set({ dashboardKPIs: kpis });
    return kpis;
  },

  getAttendanceRecord: (id) => {
    return attendanceService.getAttendanceRecord(id);
  },

  getAttendanceByEmployee: (employeeId, date) => {
    return attendanceService.getAttendanceByEmployee(employeeId, date);
  },

  getAttendanceByDateRange: (projectId, startDate, endDate) => {
    return attendanceService.getAttendanceByDateRange(projectId, startDate, endDate);
  },
}));
