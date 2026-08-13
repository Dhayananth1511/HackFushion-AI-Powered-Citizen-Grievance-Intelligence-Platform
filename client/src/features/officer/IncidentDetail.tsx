import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout';
import { Card, Button, StatusBadge, PriorityBadge } from '../../components/ui';
import { incidentsApi } from '../../services/api';
import type { Incident } from '../../types';
import { ArrowLeft, CheckCircle2, AlertTriangle, Play, MapPin, Users, Activity } from 'lucide-react';

export const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      incidentsApi.getById(id)
        .then(data => setIncident(data))
        .catch(err => console.error('Failed to load incident', err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  if (!incident) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-800">Incident Not Found</h2>
          <Button onClick={() => navigate('/officer')} className="mt-4">Back to Dashboard</Button>
        </div>
      </AppLayout>
    );
  }

  const handleStatusUpdate = async (status: string) => {
    if (!id) return;
    try {
      if (status === 'accepted') await incidentsApi.accept(id);
      else if (status === 'resolved') await incidentsApi.resolve(id);
      else await incidentsApi.updateStatus(id, status, 'Status updated by officer');
      
      const updated = await incidentsApi.getById(id);
      setIncident(updated);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <button 
          onClick={() => navigate('/officer')}
          className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Incidents
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{incident.title}</h1>
              <span className="bg-slate-100 text-slate-600 font-mono text-sm px-2 py-1 rounded-md font-bold">{incident.id}</span>
            </div>
            <p className="text-slate-500">{incident.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={incident.status} />
            <PriorityBadge level={incident.priorityLevel} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Location</div>
              <div className="font-bold text-slate-900">{incident.address}</div>
            </div>
          </Card>
          
          <Card className="p-4 flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Affected Citizens</div>
              <div className="font-bold text-slate-900">{incident.affectedCitizenCount} reported</div>
            </div>
          </Card>

          <Card className="p-4 flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Priority Score</div>
              <div className="font-bold text-slate-900">{incident.priorityScore} / 100</div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Officer Actions</h3>
          <div className="flex flex-wrap gap-3">
            {incident.status === 'detected' && (
              <Button onClick={() => handleStatusUpdate('accepted')} className="bg-blue-600 hover:bg-blue-700">
                <Play className="w-4 h-4 mr-2" /> Accept Incident
              </Button>
            )}
            {incident.status === 'accepted' && (
              <Button onClick={() => handleStatusUpdate('in_progress')} className="bg-amber-600 hover:bg-amber-700 text-white">
                Start Field Work
              </Button>
            )}
            {incident.status === 'in_progress' && (
              <Button onClick={() => handleStatusUpdate('resolved')} className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Resolved
              </Button>
            )}
          </div>
        </Card>
        
        {incident.timeline && incident.timeline.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {incident.timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${event.status === 'done' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    {idx !== incident.timeline!.length - 1 && (
                      <div className="w-0.5 h-full bg-slate-200 mt-1"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-bold ${event.status === 'done' ? 'text-slate-900' : 'text-slate-400'}`}>
                      {event.step}
                    </p>
                    <p className="text-xs text-slate-500">{event.description}</p>
                    {event.time && <p className="text-xs text-slate-400 mt-1">{new Date(event.time).toLocaleString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};
