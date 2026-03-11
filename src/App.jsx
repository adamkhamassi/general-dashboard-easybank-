import React, { useState, useMemo } from 'react';
import { Users, TrendingUp, FileText, Landmark, DollarSign, Gift, Clock, CheckCircle, AlertTriangle, BarChart3, Target, Zap, RefreshCw, Play, Pause, AlertCircle, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, PieChart, Pie, ComposedChart } from 'recharts';

export default function App() {
  const [isRunning, setIsRunning] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(4); // Index de mois (0-4 pour les 5 mois)

  // ===== DATA MODEL - ÉTAPES DU PROCESSUS =====
  const processData = {
    lightApp: {
      leadsEntrants: 1250,
      completionRate: 78.4,
      prequalificationRate: 64.2,
    },
    easyLead: {
      dossiersAcceptes: 802,
      dossiersRejetes: 156,
      enRechercheAlternative: 124,
      dossiersTotal: 1082,
    },
    easyConnect: {
      delaiMoyenIdentifiants: 48,
      uploadCompletRate: 94.3,
      eligibiliteRate: 78.5,
      dossiersEtudie: 802,
      dossiersEligibles: 629,
    },
    easyPartner: {
      transformationRate: 71.2,
      encaissementRate: 96.5,
      signaturesFinal: 448,
      commissionsTotal: 134400,
      commissionsEncaissees: 129750,
      commissionsEnAttente: 4650,
    },
  };

  // ===== CALCULS DES KPIs =====
  // Formule délai moyen: (24h × Taux Acceptation) + (24h × Taux Éligibilité) + (24h × Taux Transformation)
  const kpis = useMemo(() => {
    const lightApp = processData.lightApp;
    const easyLead = processData.easyLead;
    const easyConnect = processData.easyConnect;
    const easyPartner = processData.easyPartner;

    return {
      volumeLeadsEntrants: lightApp.leadsEntrants,
      tauxCompletionFormulaire: lightApp.completionRate,
      tauxPrequalification: lightApp.prequalificationRate,
      leadsQualifies: Math.round(lightApp.leadsEntrants * lightApp.completionRate / 100),
      tauxAcceptation: ((easyLead.dossiersAcceptes / lightApp.leadsEntrants) * 100).toFixed(1),
      tauxRejet: ((easyLead.dossiersRejetes / lightApp.leadsEntrants) * 100).toFixed(1),
      dossiersAlternative: easyLead.enRechercheAlternative,
      delaiMoyenTraitement: Math.round((24 * (easyLead.dossiersAcceptes / lightApp.leadsEntrants)) + (24 * easyConnect.eligibiliteRate / 100) + (24 * easyPartner.transformationRate / 100)),
      tauxUploadComplet: easyConnect.uploadCompletRate,
      tauxEligibilite: easyConnect.eligibiliteRate,
      tauxTransformation: easyPartner.transformationRate,
      tauxEncaissement: easyPartner.encaissementRate,
      signaturesFinal: easyPartner.signaturesFinal,
      commissionTotale: easyPartner.commissionsTotal,
      commissionEncaissee: easyPartner.commissionsEncaissees,
      funnelData: [
        { etape: 'Leads Entrants', volume: lightApp.leadsEntrants, percent: 100 },
        { etape: 'EASYLEAD Acceptés', volume: easyLead.dossiersAcceptes, percent: ((easyLead.dossiersAcceptes / lightApp.leadsEntrants) * 100).toFixed(1) },
        { etape: 'EASYCONNECT Éligibles', volume: easyConnect.dossiersEligibles, percent: ((easyConnect.dossiersEligibles / lightApp.leadsEntrants) * 100).toFixed(1) },
        { etape: 'EASYPARTNER', volume: easyPartner.signaturesFinal, percent: ((easyPartner.signaturesFinal / lightApp.leadsEntrants) * 100).toFixed(1) },
      ],
      tauxConversionGlobal: ((easyPartner.signaturesFinal / lightApp.leadsEntrants) * 100).toFixed(2),
    };
  }, []);

  // ===== DONNÉES MENSUELLES =====
  const monthlyData = [
    { month: 'Janv', leads: 1050, accepted: 672, eligible: 527, accordFinale: 374 },
    { month: 'Févr', leads: 1120, accepted: 717, eligible: 563, accordFinale: 400 },
    { month: 'Mars', leads: 1200, accepted: 768, eligible: 601, accordFinale: 427 },
    { month: 'Avr', leads: 1180, accepted: 755, eligible: 591, accordFinale: 420 },
    { month: 'Mai', leads: 1250, accepted: 802, eligible: 629, accordFinale: 448 },
  ];

  const gaugeValue = 65;
  const commissionsData = [
    { status: 'Encaissées', amount: 129750, color: '#10b981' },
    { status: 'En Attente', amount: 4650, color: '#f59e0b' },
  ];

  const formatCurrency = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K TND`;
    return `${Math.round(value)} TND`;
  };

  const formatPercent = (value) => `${parseFloat(value).toFixed(1)}%`;

  // ===== DONNÉES DU MOIS SÉLECTIONNÉ =====
  const selectedMonthData = monthlyData[selectedMonth];

  // ===== SÉLECTEUR DE MOIS =====
  const renderMonthSelector = () => (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
      {monthlyData.map((data, idx) => (
        <button
          key={idx}
          onClick={() => setSelectedMonth(idx)}
          style={{
            padding: '10px 18px',
            backgroundColor: selectedMonth === idx ? '#3b82f6' : '#fff',
            color: selectedMonth === idx ? '#fff' : '#475569',
            border: selectedMonth === idx ? 'none' : '2px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'all 0.3s',
            boxShadow: selectedMonth === idx ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        >
          {data.month}
        </button>
      ))}
    </div>
  );

  // ===== VUE EXECUTIVE =====
  const renderExecutive = () => (
    <div style={{ marginTop: '12px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px' }}>📊 Vue Executive</h2>
      {renderMonthSelector()}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '18px' }}>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #ef4444' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Leads</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444', margin: '8px 0' }}>{selectedMonthData.leads}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Leads entrants</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #8b5cf6' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Acceptés</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6', margin: '8px 0' }}>{selectedMonthData.accepted}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Acceptation</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #06b6d4' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Éligibles</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#06b6d4', margin: '8px 0' }}>{selectedMonthData.eligible}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Lead → Accord Finale</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>🎯 Entonnoir de Conversion</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '150px' }}>
          {kpis.funnelData.map((step, idx) => {
            const color = idx === 0 ? '#ef4444' : idx === 1 ? '#8b5cf6' : idx === 2 ? '#06b6d4' : '#10b981';
            return (
              <div key={idx} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                  {step.percent}%
                </div>
                <div style={{ width: '18px', backgroundColor: '#e2e8f0', borderRadius: '999px', height: '110px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: color,
                      height: `${step.percent}%`,
                      transition: 'height 0.4s',
                      borderRadius: '999px'
                    }}
                  />
                </div>
                <div style={{ marginTop: '4px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{step.etape}</p>
                  <p style={{ fontSize: '10px', color: '#64748b', margin: '2px 0 0 0' }}>
                    {step.volume} dossiers
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ===== VUE OPÉRATIONNELLE =====
  const renderOperational = () => (
    <div style={{ marginTop: '12px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px' }}>⚙️ Vue Opérationnelle</h2>
      {renderMonthSelector()}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #ef4444' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Leads</p>
          <p style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{selectedMonthData.leads}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #8b5cf6' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Acceptés</p>
          <p style={{ color: '#8b5cf6', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{selectedMonthData.accepted}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #06b6d4' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Éligibles</p>
          <p style={{ color: '#06b6d4', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{selectedMonthData.eligible}</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>⏱️ Délai Moyen Traitement</h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#06b6d4', margin: '8px 0' }}>{kpis.delaiMoyenTraitement}h</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Réel vs 4h objectif</div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', marginTop: '6px' }}>✅ Dans les délais (65%)</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>📋 KPIs par Étape</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
              <p style={{ color: '#475569', fontSize: '11px', margin: 0, fontWeight: '600' }}>Light App</p>
              <p style={{ color: '#ef4444', fontSize: '16px', fontWeight: 'bold', margin: '2px 0 0 0' }}>{formatPercent(kpis.tauxCompletionFormulaire)}</p>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
              <p style={{ color: '#475569', fontSize: '11px', margin: 0, fontWeight: '600' }}>EASYLEAD</p>
              <p style={{ color: '#8b5cf6', fontSize: '16px', fontWeight: 'bold', margin: '2px 0 0 0' }}>{kpis.tauxAcceptation}</p>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #06b6d4' }}>
              <p style={{ color: '#475569', fontSize: '11px', margin: 0, fontWeight: '600' }}>EASYCONNECT</p>
              <p style={{ color: '#06b6d4', fontSize: '16px', fontWeight: 'bold', margin: '2px 0 0 0' }}>{formatPercent(kpis.tauxEligibilite)}</p>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <p style={{ color: '#475569', fontSize: '11px', margin: 0, fontWeight: '600' }}>Easy Partner</p>
              <p style={{ color: '#10b981', fontSize: '16px', fontWeight: 'bold', margin: '2px 0 0 0' }}>{kpis.signaturesFinal}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );

  // ===== VUE CONVERSION =====
  const renderConversion = () => (
    <div style={{ marginTop: '12px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px' }}>📊 Vue Conversion</h2>
      {renderMonthSelector()}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #ef4444' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Leads</p>
          <p style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{selectedMonthData.leads}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #8b5cf6' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Acceptés</p>
          <p style={{ color: '#8b5cf6', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{selectedMonthData.accepted}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #06b6d4' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Easy Partner</p>
          <p style={{ color: '#06b6d4', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{selectedMonthData.accordFinale}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #10b981' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Taux Conv</p>
          <p style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{((selectedMonthData.accepted / selectedMonthData.leads) * 100).toFixed(1)}%</p>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '22px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>Performance par Mois</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#475569' }}>Mois</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Leads</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Acceptés</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>% Conv</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Éligibles</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Accord Finale</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>% Final</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, idx) => {
                const convPercent = ((row.accepted / row.leads) * 100).toFixed(1);
                const finalPercent = ((row.accordFinale / row.leads) * 100).toFixed(1);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>{row.month}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>{row.leads}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#475569', fontWeight: '600' }}>{row.accepted}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#8b5cf6', fontWeight: '600' }}>{convPercent}%</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#475569', fontWeight: '600' }}>{row.eligible}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#06b6d4', fontWeight: '600' }}>{row.accordFinale}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#10b981', fontWeight: '600' }}>{finalPercent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>Points de Friction</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ padding: '15px', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '8px' }}>
              <p style={{ color: '#7f1d1d', fontSize: '13px', fontWeight: '600', margin: 0 }}>Light App → EASYLEAD</p>
              <p style={{ color: '#991b1b', fontSize: '24px', fontWeight: 'bold', margin: '8px 0 0 0' }}>{kpis.tauxAcceptation}</p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#ecfdf5', borderLeft: '4px solid #10b981', borderRadius: '8px' }}>
              <p style={{ color: '#15803d', fontSize: '13px', fontWeight: '600', margin: 0 }}>EASYCONNECT → EASYPARTNER</p>
              <p style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold', margin: '8px 0 0 0' }}>{kpis.tauxTransformation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== VUE FINANCE =====
  const renderFinance = () => (
    <div style={{ marginTop: '12px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px' }}>💰 Vue Finance</h2>
      {renderMonthSelector()}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #22c55e' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Leads</p>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#22c55e', margin: '8px 0' }}>{selectedMonthData.leads}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Leads entrants</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #f59e0b' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>{selectedMonthData.month} - Acceptés</p>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#f59e0b', margin: '8px 0' }}>{selectedMonthData.accepted}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Dossiers acceptés</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>Répartition Commissions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={commissionsData} margin={{ bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis dataKey="status" type="category" axisLine={false} tickLine={false} />
              <YAxis type="number" axisLine={false} tickLine={false} formatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {commissionsData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '14px 24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>💼 GENERAL DASHBOARD</h1>
            <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '12px' }}>Dashboard de Pilotage </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsRunning(!isRunning)}
              style={{ padding: '10px 16px', backgroundColor: isRunning ? '#ef4444' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '13px' }}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? 'Live' : 'Pause'}
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '13px' }}
            >
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '18px 16px' }}>
        {renderExecutive()}
        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px dashed #e2e8f0' }} />
        {renderOperational()}
        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px dashed #e2e8f0' }} />
        {renderConversion()}
        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px dashed #e2e8f0' }} />
        {renderFinance()}
      </div>

      <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '14px 24px', marginTop: '24px', textAlign: 'center', fontSize: '11px' }}>
        <p style={{ margin: 0 }}>EASY-FINANCE v3.0 | Formules: Conversion = Easy Partner/Leads | Encaissement = Commission payée/Commission totale | © EasyBank 2026</p>
      </div>
    </div>
  );
}
