// ============================================================
// BUILDCORE ERP - QA/QC + HSE + DOCUMENT MANAGEMENT + COMMUNICATION TYPES
// Part 29: Quality, Safety, Documents & Communication
// ============================================================

// ============================================================
// QA/QC TYPES
// ============================================================

export interface ITP {
  id: string;
  projectId: string;
  activity: string;
  inspectionType: string;
  testType?: string;
  frequency: string;
  acceptanceCriteria: string;
  holdPoint: boolean;
  witnessPoint: boolean;
  reviewPoint: boolean;
  responsibleAuthority: string;
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface WIR {
  id: string;
  projectId: string;
  wirNumber: string;
  activity: string;
  location: string;
  workDescription: string;
  workCompleteDate: string;
  inspectionDate?: string;
  inspectorId?: string;
  inspectorName?: string;
  inspectionResult?: 'ACCEPTED' | 'REJECTED' | 'OBSERVATION';
  remarks?: string;
  measurementEligible: boolean;
  status: 'PENDING' | 'INSPECTED' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface MIR {
  id: string;
  projectId: string;
  mirNumber: string;
  poId?: string;
  deliveryId?: string;
  grnId?: string;
  materialId: string;
  materialName: string;
  quantity: number;
  inspectionDate?: string;
  inspectorId?: string;
  inspectorName?: string;
  testId?: string;
  inspectionResult?: 'ACCEPTED' | 'REJECTED';
  remarks?: string;
  status: 'PENDING' | 'INSPECTED' | 'TESTED' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  id: string;
  projectId: string;
  inspectionNumber: string;
  type: 'WIR' | 'MIR' | 'MATERIAL' | 'EQUIPMENT';
  referenceId: string;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  result: 'ACCEPTED' | 'REJECTED' | 'OBSERVATION';
  remarks?: string;
  attachments?: string[];
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface Test {
  id: string;
  projectId: string;
  testNumber: string;
  testType: string;
  sampleId?: string;
  sampleDescription?: string;
  labId?: string;
  labName?: string;
  testDate?: string;
  result?: string;
  acceptanceCriteria?: string;
  resultStatus?: 'PASS' | 'FAIL' | 'PENDING';
  certificateId?: string;
  retest?: boolean;
  remarks?: string;
  status: 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface NCR {
  id: string;
  projectId: string;
  ncrNumber: string;
  activity: string;
  location: string;
  description: string;
  evidence?: string[];
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  responsiblePersonId: string;
  responsiblePersonName: string;
  dueDate: string;
  verification?: string;
  closure?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'VERIFIED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface CAPA {
  id: string;
  projectId: string;
  capaNumber: string;
  ncrId?: string;
  type: 'CORRECTIVE' | 'PREVENTIVE';
  description: string;
  responsiblePersonId: string;
  responsiblePersonName: string;
  dueDate: string;
  actionTaken?: string;
  verification?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'VERIFIED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface MaterialApproval {
  id: string;
  projectId: string;
  materialId: string;
  materialName: string;
  vendorId: string;
  vendorName: string;
  approvalDate?: string;
  approvedBy?: string;
  approvedByName?: string;
  remarks?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface Calibration {
  id: string;
  equipmentId: string;
  equipmentName: string;
  serialNumber: string;
  calibrationDate: string;
  nextCalibrationDate: string;
  certificateNumber: string;
  certificatePath?: string;
  status: 'VALID' | 'EXPIRED' | 'DUE_SOON';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// HSE TYPES
// ============================================================

export interface SafetyInduction {
  id: string;
  projectId: string;
  personId: string;
  personName: string;
  inductionDate: string;
  trainerId: string;
  trainerName: string;
  topics: string[];
  certificateNumber?: string;
  status: 'COMPLETED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

export interface ToolboxTalk {
  id: string;
  projectId: string;
  talkDate: string;
  topic: string;
  conductorId: string;
  conductorName: string;
  attendees: string[];
  topics: string[];
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PPE {
  id: string;
  projectId: string;
  personId: string;
  personName: string;
  ppeType: string;
  issueDate: string;
  expiryDate?: string;
  condition: 'GOOD' | 'FAIR' | 'POOR' | 'REPLACED';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyInspection {
  id: string;
  projectId: string;
  inspectionNumber: string;
  inspectionDate: string;
  inspectorId: string;
  inspectorName: string;
  location: string;
  findings: string[];
  observations: string[];
  recommendations?: string;
  status: 'COMPLETED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

export interface Permit {
  id: string;
  projectId: string;
  permitNumber: string;
  permitType: 'HOT_WORK' | 'WORK_AT_HEIGHT' | 'EXCAVATION' | 'ELECTRICAL' | 'CONFINED_SPACE' | 'LIFTING' | 'TRAFFIC' | 'OTHER';
  workDescription: string;
  location: string;
  requestedBy: string;
  requestedByName: string;
  requestedDate: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  validFrom: string;
  validTo: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  projectId: string;
  incidentNumber: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  personInvolved?: string;
  personName?: string;
  incidentType: 'INJURY' | 'NEAR_MISS' | 'PROPERTY_DAMAGE' | 'ENVIRONMENTAL' | 'OTHER';
  severity: 'MINOR' | 'MODERATE' | 'SERIOUS' | 'FATAL';
  description: string;
  photos?: string[];
  witnesses?: string[];
  immediateAction?: string;
  rootCause?: string;
  correctiveAction?: string;
  closure?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'INVESTIGATED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface NearMiss {
  id: string;
  projectId: string;
  nearMissNumber: string;
  date: string;
  time: string;
  location: string;
  description: string;
  reportedBy: string;
  reportedByName: string;
  potentialConsequence?: string;
  immediateAction?: string;
  correctiveAction?: string;
  status: 'REPORTED' | 'INVESTIGATED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface SafetyObservation {
  id: string;
  projectId: string;
  observationNumber: string;
  date: string;
  location: string;
  photo?: string;
  observation: string;
  reportedBy: string;
  reportedByName: string;
  assignedTo?: string;
  assignedToName?: string;
  correctiveAction?: string;
  verification?: string;
  status: 'REPORTED' | 'ASSIGNED' | 'CORRECTED' | 'VERIFIED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// DOCUMENT MANAGEMENT TYPES
// ============================================================

export interface Document {
  id: string;
  projectId?: string;
  documentNumber: string;
  title: string;
  description?: string;
  documentType: string;
  discipline?: string;
  revision: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';
  uploadedBy: string;
  uploadedByName: string;
  uploadedDate: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  expiryDate?: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  tags?: string[];
  permissions?: string[];
  supersededBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Drawing {
  id: string;
  projectId: string;
  drawingNumber: string;
  title: string;
  discipline: string;
  revision: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';
  date: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  supersededVersion?: string;
  distribution?: string[];
  filePath: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface RFI {
  id: string;
  projectId: string;
  rfiNumber: string;
  location?: string;
  drawingId?: string;
  drawingNumber?: string;
  query: string;
  raisedBy: string;
  raisedByName: string;
  raisedDate: string;
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: string;
  response?: string;
  responseDate?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESPONDED' | 'CLOSED';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// CHAT TYPES
// ============================================================

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'PDF';
  content: string;
  filePath?: string;
  replyToId?: string;
  forwardedFromId?: string;
  mentions?: string[];
  reactions?: { [emoji: string]: string[] };
  pinned: boolean;
  readBy: string[];
  timestamp: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  projectId?: string;
  chatType: 'ONE_TO_ONE' | 'GROUP' | 'PROJECT' | 'SITE' | 'DEPARTMENT' | 'MANAGEMENT';
  name?: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatAction {
  id: string;
  messageId: string;
  actionType: 'TASK' | 'MATERIAL_REQUEST' | 'APPROVAL' | 'RFI' | 'SAFETY_OBSERVATION' | 'ISSUE' | 'REMINDER';
  actionId: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface TypingIndicator {
  chatId: string;
  userId: string;
  userName: string;
  timestamp: string;
}
