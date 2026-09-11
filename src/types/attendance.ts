// ============================================================
// BUILDCORE ERP - GEO-FENCED ATTENDANCE TYPES
// Part 26: Geo-Fenced Attendance / Site Manpower
// ============================================================

// ============================================================
// 1. GEO-FENCE CONFIGURATION
// ============================================================
export interface GeoFence {
  id: string;
  projectId: string;
  siteId: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  effectiveDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 2. GEO-FENCED ATTENDANCE RECORD
// ============================================================
export interface GeoFencedAttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: ClockRecord;
  clockOut?: ClockRecord;
  shiftId?: string;
  workingHours?: number;
  overtimeHours?: number;
  status: GeoFencedAttendanceStatus;
  geoStatus: GeoStatus;
  isCorrected: boolean;
  originalRecord?: string;
  syncStatus: SyncStatus;
  projectId: string;
  siteId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClockRecord {
  time: string;
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  deviceId: string;
  networkType: 'WIFI' | 'MOBILE' | 'OFFLINE';
  geoStatus: GeoStatus;
}

export type GeoFencedAttendanceStatus = 
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'EARLY'
  | 'HALF_DAY'
  | 'LEAVE'
  | 'HOLIDAY'
  | 'WEEKLY_OFF'
  | 'MISSING_PUNCH';

export type GeoStatus = 
  | 'VALID'
  | 'OUTSIDE'
  | 'GPS_UNAVAILABLE'
  | 'LOW_ACCURACY'
  | 'MANUAL_REVIEW';

export type SyncStatus = 
  | 'PENDING_SYNC'
  | 'SYNCED'
  | 'FAILED'
  | 'CONFLICT'
  | 'REVIEW_REQUIRED';

// ============================================================
// 3. ANTI-PROXY ALERT
// ============================================================
export interface AntiProxyAlert {
  id: string;
  alertType: AntiProxyAlertType;
  employeeId: string;
  date: string;
  details: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'DISMISSED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
}

export type AntiProxyAlertType = 
  | 'SAME_DEVICE_MULTIPLE_EMPLOYEES'
  | 'IMPOSSIBLE_TRAVEL'
  | 'REPEATED_LOCATION'
  | 'DUPLICATE_PUNCH'
  | 'SUSPICIOUS_GPS'
  | 'EXCESSIVE_MANUAL_CORRECTION';

// ============================================================
// 4. SHIFT CONFIGURATION
// ============================================================
export interface Shift {
  id: string;
  projectId: string;
  siteId: string;
  shiftName: string;
  shiftType: 'DAY' | 'NIGHT' | 'ROTATIONAL' | 'CUSTOM';
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
  gracePeriod: number; // in minutes
  overtimeThreshold: number; // in minutes
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 5. ATTENDANCE CORRECTION
// ============================================================
export interface AttendanceCorrection {
  id: string;
  attendanceId: string;
  employeeId: string;
  correctionType: 'CLOCK_IN' | 'CLOCK_OUT' | 'BOTH';
  originalClockIn?: string;
  originalClockOut?: string;
  requestedClockIn?: string;
  requestedClockOut?: string;
  reason: string;
  status: CorrectionStatus;
  workflow: CorrectionWorkflow[];
  createdAt: string;
  updatedAt: string;
}

export type CorrectionStatus = 
  | 'SUBMITTED'
  | 'SUPERVISOR_APPROVED'
  | 'PROJECT_AUTHORITY_APPROVED'
  | 'HR_APPROVED'
  | 'REJECTED';

export interface CorrectionWorkflow {
  level: 'SUPERVISOR' | 'PROJECT_AUTHORITY' | 'HR';
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt?: string;
  comments?: string;
}

// ============================================================
// 6. MANPOWER PLANNING
// ============================================================
export interface ManpowerPlan {
  id: string;
  projectId: string;
  siteId: string;
  date: string;
  plannedManpower: ManpowerRequirement[];
  actualManpower: ManpowerActual[];
  shortage: number;
  surplus: number;
  createdAt: string;
  updatedAt: string;
}

export interface ManpowerRequirement {
  trade: string;
  required: number;
  skillLevel: 'UNSKILLED' | 'SEMI_SKILLED' | 'SKILLED' | 'HIGHLY_SKILLED';
}

export interface ManpowerActual {
  trade: string;
  present: number;
  absent: number;
  onLeave: number;
}

// ============================================================
// 7. PRODUCTIVITY RECORD
// ============================================================
export interface ProductivityRecord {
  id: string;
  employeeId: string;
  date: string;
  trade: string;
  manHours: number;
  quantityExecuted: number;
  unit: string;
  productivity: number; // Quantity / Man-hour
  projectId: string;
  siteId: string;
  createdAt: string;
}

// ============================================================
// 8. ATTENDANCE DASHBOARD KPIs
// ============================================================
export interface AttendanceDashboardKPIs {
  present: number;
  absent: number;
  late: number;
  early: number;
  overtime: number;
  missingPunch: number;
  outsideGeofence: number;
  correctionPending: number;
  siteWiseManpower: SiteManpower[];
  tradeWiseManpower: TradeManpower[];
}

export interface SiteManpower {
  siteId: string;
  siteName: string;
  present: number;
  absent: number;
  total: number;
}

export interface TradeManpower {
  trade: string;
  present: number;
  absent: number;
  total: number;
}
