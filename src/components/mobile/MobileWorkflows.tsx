// ============================================================
// BUILDCORE ERP - MOBILE WORKFLOWS
// Part 30: Mobile-First Workflows for Field Operations
// ============================================================

import React, { useState } from 'react';
import { Camera, MapPin, Clock, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { Card, Button } from '../ui';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';

// ============================================================
// MOBILE ATTENDANCE WORKFLOW
// ============================================================
export const MobileAttendance: React.FC = () => {
  const { user } = useAuthStore();
  const { project } = useProjectStore();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [status, setStatus] = useState<'PRESENT' | 'ABSENT' | 'HALF_DAY'>('PRESENT');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const capturePhoto = () => {
    // In a real app, this would use the camera API
    setPhoto('captured_photo.jpg');
  };

  const markAttendance = () => {
    // In a real app, this would submit to the backend
    console.log('Marking attendance:', { status, location, photo, project: project?.id });
    alert(`Attendance marked as ${status}`);
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Attendance Status</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={status === 'PRESENT' ? 'primary' : 'outline'}
                onClick={() => setStatus('PRESENT')}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Present
              </Button>
              <Button
                variant={status === 'HALF_DAY' ? 'primary' : 'outline'}
                onClick={() => setStatus('HALF_DAY')}
                className="w-full"
              >
                <Clock className="w-4 h-4 mr-2" />
                Half Day
              </Button>
              <Button
                variant={status === 'ABSENT' ? 'primary' : 'outline'}
                onClick={() => setStatus('ABSENT')}
                className="w-full"
              >
                <Activity className="w-4 h-4 mr-2" />
                Absent
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Button
              variant="outline"
              onClick={getLocation}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Get Location'}
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Photo</label>
            <Button
              variant="outline"
              onClick={capturePhoto}
              className="w-full"
            >
              <Camera className="w-4 h-4 mr-2" />
              {photo ? 'Photo Captured' : 'Capture Photo'}
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={markAttendance}
            className="w-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// MOBILE SAFETY OBSERVATION
// ============================================================
export const MobileSafetyObservation: React.FC = () => {
  const { project } = useProjectStore();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [observation, setObservation] = useState('');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const capturePhoto = () => {
    setPhoto('safety_photo.jpg');
  };

  const submitObservation = () => {
    console.log('Submitting safety observation:', { observation, location, photo, severity, project: project?.id });
    alert('Safety observation submitted');
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <h2 className="text-xl font-bold mb-4">Safety Observation</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Observation</label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              rows={4}
              placeholder="Describe the safety observation..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Severity</label>
            <div className="grid grid-cols-4 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((level) => (
                <Button
                  key={level}
                  variant={severity === level ? 'primary' : 'outline'}
                  onClick={() => setSeverity(level)}
                  className="w-full"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Button
              variant="outline"
              onClick={getLocation}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Get Location'}
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Photo</label>
            <Button
              variant="outline"
              onClick={capturePhoto}
              className="w-full"
            >
              <Camera className="w-4 h-4 mr-2" />
              {photo ? 'Photo Captured' : 'Capture Photo'}
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={submitObservation}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Observation
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// MOBILE DAILY PROGRESS
// ============================================================
export const MobileDailyProgress: React.FC = () => {
  const { project } = useProjectStore();
  const [activities, setActivities] = useState<Array<{
    activity: string;
    planned: number;
    actual: number;
    manpower: number;
  }>>([]);

  const addActivity = () => {
    setActivities([...activities, { activity: '', planned: 0, actual: 0, manpower: 0 }]);
  };

  const updateActivity = (index: number, field: string, value: any) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  const submitProgress = () => {
    console.log('Submitting daily progress:', { activities, project: project?.id });
    alert('Daily progress submitted');
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <h2 className="text-xl font-bold mb-4">Daily Progress Report</h2>
        
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <Card key={index} className="bg-gray-50 dark:bg-gray-800">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Activity</label>
                  <input
                    type="text"
                    value={activity.activity}
                    onChange={(e) => updateActivity(index, 'activity', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    placeholder="Activity name"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Planned</label>
                    <input
                      type="number"
                      value={activity.planned}
                      onChange={(e) => updateActivity(index, 'planned', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Actual</label>
                    <input
                      type="number"
                      value={activity.actual}
                      onChange={(e) => updateActivity(index, 'actual', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Manpower</label>
                    <input
                      type="number"
                      value={activity.manpower}
                      onChange={(e) => updateActivity(index, 'manpower', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addActivity}
            className="w-full"
          >
            Add Activity
          </Button>

          <Button
            variant="primary"
            onClick={submitProgress}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Progress
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// MOBILE PHOTO CAPTURE
// ============================================================
export const MobilePhotoCapture: React.FC<{ type: 'site' | 'quality' | 'safety' | 'material' | 'document' | 'invoice' }> = ({ type }) => {
  const { project } = useProjectStore();
  const [photos, setPhotos] = useState<string[]>([]);
  const [metadata, setMetadata] = useState({
    location: null as { lat: number; lng: number } | null,
    description: '',
  });

  const capturePhoto = () => {
    // In a real app, this would use the camera API
    setPhotos([...photos, `${type}_photo_${photos.length + 1}.jpg`]);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMetadata({
            ...metadata,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const submitPhotos = () => {
    console.log('Submitting photos:', { type, photos, metadata, project: project?.id });
    alert(`${type} photos submitted`);
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <h2 className="text-xl font-bold mb-4">Capture {type.charAt(0).toUpperCase() + type.slice(1)} Photos</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              rows={3}
              placeholder="Describe the photo..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Button
              variant="outline"
              onClick={getLocation}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {metadata.location ? `${metadata.location.lat.toFixed(4)}, ${metadata.location.lng.toFixed(4)}` : 'Get Location'}
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Photos</label>
            <div className="space-y-2">
              {photos.map((photo, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">{photo}</span>
                  <Camera className="w-4 h-4 text-gray-400" />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={capturePhoto}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={submitPhotos}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Photos
          </Button>
        </div>
      </Card>
    </div>
  );
};
