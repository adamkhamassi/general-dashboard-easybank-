import React, { useState, useMemo } from 'react';
import { Users, TrendingUp, FileText, Landmark, DollarSign, Gift, Clock, CheckCircle, AlertTriangle, BarChart3, Target, Zap, RefreshCw, Play, Pause, AlertCircle, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, PieChart, Pie, ComposedChart } from 'recharts';

export default function App() {
  const [isRunning, setIsRunning] = useState(true);

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
      delaiMoyenTraitement: easyConnect.delaiMoyenIdentifiants,
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
        { etape: 'EASYPARTNER Signatures', volume: easyPartner.signaturesFinal, percent: ((easyPartner.signaturesFinal / lightApp.leadsEntrants) * 100).toFixed(1) },
      ],
      tauxConversionGlobal: ((easyPartner.signaturesFinal / lightApp.leadsEntrants) * 100).toFixed(2),
    };
  }, []);

  // ===== DONNÉES MENSUELLES =====
  const monthlyData = [
    { month: 'Janv', leads: 1050, accepted: 672, eligible: 527, signatures: 374, revenue: 112200 },
    { month: 'Févr', leads: 1120, accepted: 717, eligible: 563, signatures: 400, revenue: 120000 },
    { month: 'Mars', leads: 1200, accepted: 768, eligible: 601, signatures: 427, revenue: 128100 },
    { month: 'Avr', leads: 1180, accepted: 755, eligible: 591, signatures: 420, revenue: 126000 },
    { month: 'Mai', leads: 1250, accepted: 802, eligible: 629, signatures: 448, revenue: 134400 },
  ];

  // ===== DOSSIERS EN SOUFFRANCE =====
  const dossiersEnSouffrance = [
    { id: 'D-2501', client: 'Acme Corp', etape: 'EASYCONNECT', blockedSince: '72h', raison: 'Attente documents', status: 'Critique' },
    { id: 'D-2498', client: 'Tech Innovation', etape: 'EASYLEAD', blockedSince: '56h', raison: 'Scoring insuffisant', status: 'Alerte' },
    { id: 'D-2495', client: 'Retail Solutions', etape: 'EASYPARTNER', blockedSince: '48h', raison: 'Validation partenaire', status: 'Alerte' },
    { id: 'D-2491', client: 'Finance Plus', etape: 'EASYCONNECT', blockedSince: '120h', raison: 'Documents incomplets', status: 'Critique' },
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

  // ===== VUE EXECUTIVE =====
  const renderExecutive = () => (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>📊 Vue Executive</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #ef4444' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Pipeline Actuel</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444', margin: '8px 0' }}>{kpis.volumeLeadsEntrants}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Leads entrants</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #8b5cf6' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>EASYLEAD</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6', margin: '8px 0' }}>{kpis.tauxAcceptation}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Acceptation</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #06b6d4' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Conversion Global</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#06b6d4', margin: '8px 0' }}>{kpis.tauxConversionGlobal}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Lead → Signature</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #10b981' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Revenus</p>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: '8px 0' }}>{formatCurrency(kpis.commissionTotale)}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Total ce mois</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>🎯 Entonnoir de Conversion</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {kpis.funnelData.map((step, idx) => (
            <div key={idx} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{step.etape}</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{step.volume} dossiers ({step.percent}%)</span>
              </div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '6px', height: '24px', overflow: 'hidden' }}>
                <div style={{ 
                  backgroundColor: idx === 0 ? '#ef4444' : idx === 1 ? '#8b5cf6' : idx === 2 ? '#06b6d4' : '#10b981',
                  height: '100%',
                  width: `${step.percent}%`,
                  transition: 'width 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '8px',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {step.percent}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>📈 Trend Mensuel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} style={{ fontSize: '11px' }} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} style={{ fontSize: '11px' }} />
            <Tooltip />
            <Area yAxisId="left" type="monotone" dataKey="leads" fill="#fecaca" stroke="#ef4444" strokeWidth={2} name="Leads" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // ===== VUE OPÉRATIONNELLE =====
  const renderOperational = () => (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>⚙️ Vue Opérationnelle</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>⏱️ Délai Moyen Traitement</h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#06b6d4', margin: '20px 0' }}>{kpis.delaiMoyenTraitement}h</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Réel vs 4h objectif</div>
            <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '600', marginTop: '12px' }}>✅ Dans les délais (65%)</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>📋 KPIs par Étape</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
              <p style={{ color: '#475569', fontSize: '12px', margin: 0, fontWeight: '600' }}>Light App</p>
              <p style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>{formatPercent(kpis.tauxCompletionFormulaire)}</p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
              <p style={{ color: '#475569', fontSize: '12px', margin: 0, fontWeight: '600' }}>EASYLEAD</p>
              <p style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>{kpis.tauxAcceptation}</p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #06b6d4' }}>
              <p style={{ color: '#475569', fontSize: '12px', margin: 0, fontWeight: '600' }}>EASYCONNECT</p>
              <p style={{ color: '#06b6d4', fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>{formatPercent(kpis.tauxEligibilite)}</p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <p style={{ color: '#475569', fontSize: '12px', margin: 0, fontWeight: '600' }}>EASYPARTNER</p>
              <p style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>{kpis.signaturesFinal}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>🚨 Dossiers en Souffrance</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#475569' }}>Dossier</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#475569' }}>Client</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#475569' }}>Étape</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#475569' }}>Bloqué</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#475569' }}>Raison</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dossiersEnSouffrance.map((d, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', color: '#1e293b', fontWeight: '600' }}>{d.id}</td>
                  <td style={{ padding: '12px', color: '#475569' }}>{d.client}</td>
                  <td style={{ padding: '12px', color: '#475569' }}>{d.etape}</td>
                  <td style={{ padding: '12px', color: '#475569' }}>{d.blockedSince}</td>
                  <td style={{ padding: '12px', color: '#475569' }}>{d.raison}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: d.status === 'Critique' ? '#fee2e2' : '#fef3c7',
                      color: d.status === 'Critique' ? '#991b1b' : '#92400e'
                    }}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ===== VUE CONVERSION =====
  const renderConversion = () => (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>📊 Vue Conversion</h2>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>Performance par Mois</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#475569' }}>Mois</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Leads</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Acceptés</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>% Conv</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Éligibles</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Signatures</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>% Final</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, idx) => {
                const convPercent = ((row.accepted / row.leads) * 100).toFixed(1);
                const finalPercent = ((row.signatures / row.leads) * 100).toFixed(1);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>{row.month}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>{row.leads}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#475569', fontWeight: '600' }}>{row.accepted}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#8b5cf6', fontWeight: '600' }}>{convPercent}%</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#475569', fontWeight: '600' }}>{row.eligible}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#475569', fontWeight: '600' }}>{row.signatures}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#10b981', fontWeight: '600' }}>{finalPercent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
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

        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>Recommandations</h3>
          <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '13px', lineHeight: '1.8' }}>
            <li style={{ color: '#475569', marginBottom: '10px' }}>Renforcer EASYLEAD: Scoring moins strict</li>
            <li style={{ color: '#475569', marginBottom: '10px' }}>Améliorer EASYCONNECT: Pré-qualification KYC</li>
            <li style={{ color: '#475569', marginBottom: '10px' }}>Optimiser délais: Cible 1.5h</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // ===== VUE FINANCE =====
  const renderFinance = () => (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>💰 Vue Finance</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #10b981' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Commission Totale</p>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#10b981', margin: '8px 0' }}>{formatCurrency(kpis.commissionTotale)}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>{kpis.signaturesFinal} signatures</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #22c55e' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Commission Encaissée</p>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#22c55e', margin: '8px 0' }}>{formatCurrency(kpis.commissionEncaissee)}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>{formatPercent(kpis.tauxEncaissement)}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #f59e0b' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>En Attente</p>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#f59e0b', margin: '8px 0' }}>{formatCurrency(processData.easyPartner.commissionsEnAttente)}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>À recouvrer</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>Répartition Commissions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={commissionsData} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis dataKey="status" type="category" axisLine={false} tickLine={false} width={90} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                {commissionsData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>Revenu Cumulatif</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} formatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '20px 30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>💼 GENERAL DASHBOARD</h1>
            <p style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: '13px' }}>Dashboard de Pilotage </p>
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

      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '30px 20px' }}>
        {renderExecutive()}
        <hr style={{ margin: '50px 0', border: 'none', borderTop: '2px dashed #e2e8f0' }} />
        {renderOperational()}
        <hr style={{ margin: '50px 0', border: 'none', borderTop: '2px dashed #e2e8f0' }} />
        {renderConversion()}
        <hr style={{ margin: '50px 0', border: 'none', borderTop: '2px dashed #e2e8f0' }} />
        {renderFinance()}
      </div>

      <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '20px 30px', marginTop: '40px', textAlign: 'center', fontSize: '12px' }}>
        <p style={{ margin: 0 }}>EASY-FINANCE v3.0 | Formules: Conversion = Signatures/Leads | Encaissement = Commission payée/Commission totale | © EasyBank 2026</p>
      </div>
    </div>
  );
}
