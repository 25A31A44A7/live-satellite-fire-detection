'use client';

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  FileText, 
  Download, 
  Flame, 
  Building2, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';
import { FireEventDto } from '@/types';

export default function ReportsPage() {
  const [fires, setFires] = useState<FireEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<string>('ALL');
  const [reportType, setReportType] = useState('FULL_BRIEF');

  useEffect(() => {
    fetch('/api/fires/live?limit=100')
      .then((r) => r.json())
      .then((data) => {
        setFires(data.fires || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const activeItems = selectedIncident === 'ALL' 
      ? fires 
      : fires.filter((f) => f.id === selectedIncident);

    // Title Header
    doc.setFillColor(7, 12, 24);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('LIVE-SATELLITE INCIDENT INTELLIGENCE REPORT', 14, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(56, 189, 248);
    doc.text('AI-Based Thermal Anomaly & Industrial Fire Surveillance Brief', 14, 25);
    doc.setTextColor(200, 200, 200);
    doc.text(`Generated: ${new Date().toUTCString()} | Sensor Passes: VIIRS / MODIS`, 14, 32);

    // Summary Telemetry
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Incident Telemetry Summary (${activeItems.length} records)`, 14, 48);

    // Table
    const tableRows = activeItems.map((f) => [
      f.locationName,
      `${f.latitude.toFixed(3)}, ${f.longitude.toFixed(3)}`,
      new Date(f.detectionTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      f.satellite.replace('_', ' '),
      `${f.frp.toFixed(1)} MW`,
      f.alertLevel,
      f.fireType.replace(/_/g, ' '),
      f.industrialFacilityName ? `${f.industrialFacilityName} (${f.distanceToIndustrialKm?.toFixed(1)}km)` : 'N/A'
    ]);

    autoTable(doc, {
      startY: 53,
      head: [['Location', 'Coordinates', 'Time (UTC)', 'Sensor', 'FRP', 'Alert', 'Classification', 'Industrial Match']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // Disclaimer
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Disclaimer: Satellite thermal detections indicate surface radiative temperature anomalies calibrated via NASA FIRMS & OSM Overpass datasets. Ground-truth verification is recommended for critical industrial alerts.',
      14,
      Math.min(finalY, 280),
      { maxWidth: 180 }
    );

    doc.save(`live-satellite-report-${Date.now()}.pdf`);
  };

  const generateCSV = () => {
    const activeItems = selectedIncident === 'ALL' 
      ? fires 
      : fires.filter((f) => f.id === selectedIncident);

    const headers = [
      'Incident_ID',
      'Location_Name',
      'Latitude',
      'Longitude',
      'Detection_Time',
      'Satellite',
      'Instrument',
      'FRP_MW',
      'Brightness_K',
      'Confidence_Pct',
      'Alert_Level',
      'Fire_Type',
      'Industrial_Area',
      'Industrial_Facility_Name',
      'Distance_To_Industrial_KM',
      'Persistence_Score_Pct'
    ];

    const rows = activeItems.map((f) => [
      f.id,
      `"${f.locationName.replace(/"/g, '""')}"`,
      f.latitude,
      f.longitude,
      f.detectionTime,
      f.satellite,
      f.instrument,
      f.frp,
      f.brightnessTemp,
      f.confidence,
      f.alertLevel,
      f.fireType,
      f.industrialArea,
      f.industrialFacilityName ? `"${f.industrialFacilityName.replace(/"/g, '""')}"` : '',
      f.distanceToIndustrialKm || '',
      f.persistenceScore
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `satellite-fire-incidents-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>INCIDENT REPORT DISPATCH</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate and export operational disaster management briefs and GIS datasets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={generatePDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate Official PDF</span>
          </button>
        </div>
      </div>

      {/* Report Customization Form */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-cyan-400" />
          <span>Report Configuration</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Target Incident
            </label>
            <select
              value={selectedIncident}
              onChange={(e) => setSelectedIncident(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Active Hotspot Detections ({fires.length} records)</option>
              {fires.map((f) => (
                <option key={f.id} value={f.id}>
                  [{f.alertLevel}] {f.locationName} ({f.frp.toFixed(1)} MW)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Report Format Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="FULL_BRIEF">Standard Incident Telemetry Brief (PDF / CSV)</option>
              <option value="EXECUTIVE_SUMMARY">Executive Disaster Assessment (Summary Table)</option>
              <option value="GIS_EXTRACT">GIS Spatial Ingestion CSV (Full Coordinates & Buffer)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-xs text-white">
            Report Data Preview ({selectedIncident === 'ALL' ? fires.length : 1} items)
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">Ready for Export</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Location</th>
                <th className="p-3">Alert</th>
                <th className="p-3">Classification</th>
                <th className="p-3">FRP</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Industrial Proximity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {(selectedIncident === 'ALL' ? fires : fires.filter((f) => f.id === selectedIncident)).map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{f.locationName}</td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {f.alertLevel}
                    </span>
                  </td>
                  <td className="p-3 text-purple-300">{f.fireType.replace(/_/g, ' ')}</td>
                  <td className="p-3 font-mono font-bold text-orange-400">{f.frp.toFixed(1)} MW</td>
                  <td className="p-3 font-mono text-cyan-400">{f.confidence}%</td>
                  <td className="p-3 text-slate-400">
                    {f.industrialFacilityName ? `${f.industrialFacilityName} (${f.distanceToIndustrialKm?.toFixed(1)}km)` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
