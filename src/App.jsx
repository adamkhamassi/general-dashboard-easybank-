import React, { useState, useMemo } from 'react';
import { Users, TrendingUp, FileText, Landmark, DollarSign, Gift, Clock, CheckCircle, AlertTriangle, BarChart3, Target, Zap, RefreshCw, Play, Pause, AlertCircle, TrendingDown, Building2, Gauge, Bell, Wallet, TrendingUp as ChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, PieChart, Pie, ComposedChart } from 'recharts';

export default function App() {
  const [isRunning, setIsRunning] = useState(true);
  const [periodGranularity, setPeriodGranularity] = useState('monthly'); // weekly | monthly | yearly
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-05-31');

  // ===== DATA MODEL - ETAPES DU PROCESSUS =====
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
      dossiersEtudies: 802,
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

    const delaiBaseHeures = 7;
    const tauxLightApp = lightApp.completionRate / 100;
    const tauxAcceptationRatio = easyLead.dossiersAcceptes / lightApp.leadsEntrants;
    const tauxEligibiliteRatio = easyConnect.eligibiliteRate / 100;
    const tauxTransformationRatio = easyPartner.transformationRate / 100;

    return {
      volumeLeadsEntrants: lightApp.leadsEntrants,
      tauxCompletionFormulaire: lightApp.completionRate,
      tauxPrequalification: lightApp.prequalificationRate,
      leadsQualifies: Math.round(lightApp.leadsEntrants * lightApp.completionRate / 100),
      tauxAcceptation: ((easyLead.dossiersAcceptes / lightApp.leadsEntrants) * 100).toFixed(1),
      tauxRejet: ((easyLead.dossiersRejetes / lightApp.leadsEntrants) * 100).toFixed(1),
      dossiersAlternative: easyLead.enRechercheAlternative,
      delaiLightApplication: Math.round(delaiBaseHeures * tauxLightApp),
      delaiEasyLead: Math.round(delaiBaseHeures * tauxAcceptationRatio),
      delaiEasyConnect: Math.round(delaiBaseHeures * tauxEligibiliteRatio),
      delaiEasyPartner: Math.round(delaiBaseHeures * tauxTransformationRatio),
      delaiMoyenTraitement:
        Math.round(delaiBaseHeures * tauxLightApp) +
        Math.round(delaiBaseHeures * tauxAcceptationRatio) +
        Math.round(delaiBaseHeures * tauxEligibiliteRatio) +
        Math.round(delaiBaseHeures * tauxTransformationRatio),
      tauxUploadComplet: easyConnect.uploadCompletRate,
      tauxEligibilite: easyConnect.eligibiliteRate,
      tauxTransformation: easyPartner.transformationRate,
      tauxEncaissement: easyPartner.encaissementRate,
      signaturesFinal: easyPartner.signaturesFinal,
      commissionTotale: easyPartner.commissionsTotal,
      commissionEncaissee: easyPartner.commissionsEncaissees,
      funnelData: [
        { etape: 'Light Application', volume: lightApp.leadsEntrants, percent: 100 },
        { etape: 'Easy Lead (Acceptes)', volume: easyLead.dossiersAcceptes, percent: ((easyLead.dossiersAcceptes / lightApp.leadsEntrants) * 100).toFixed(1) },
        { etape: 'Easy Connect (Eligibles)', volume: easyConnect.dossiersEligibles, percent: ((easyConnect.dossiersEligibles / lightApp.leadsEntrants) * 100).toFixed(1) },
        { etape: 'Easy Partner (Accord final)', volume: easyPartner.signaturesFinal, percent: ((easyPartner.signaturesFinal / lightApp.leadsEntrants) * 100).toFixed(1) },
      ],
      tauxConversionGlobal: ((easyPartner.signaturesFinal / lightApp.leadsEntrants) * 100).toFixed(2),
    };
  }, []);

  // ===== DONNEES MENSUELLES =====
  const monthlyData = [
    { month: 'Janv', leads: 1050, accepted: 672, eligible: 527, accordFinale: 374 },
    { month: 'Fevr', leads: 1120, accepted: 717, eligible: 563, accordFinale: 400 },
    { month: 'Mars', leads: 1200, accepted: 768, eligible: 601, accordFinale: 427 },
    { month: 'Avr', leads: 1180, accepted: 755, eligible: 591, accordFinale: 420 },
    { month: 'Mai', leads: 1250, accepted: 802, eligible: 629, accordFinale: 448 },
  ];

  const gaugeValue = 65;
  const commissionsData = [
    { status: 'Encaissees', amount: 129750, color: '#10b981' },
    { status: 'En Attente', amount: 4650, color: '#f59e0b' },
  ];

  const formatCurrency = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K TND`;
    return `${Math.round(value)} TND`;
  };

  const formatPercent = (value) => `${parseFloat(value).toFixed(1)}%`;

  // ===== Helpers de periode (date -> weekly/monthly/yearly) =====
  const baseYear = 2026;
  const monthLabelsFR = ['Janv', 'Fevr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];

  const parseISODate = (iso) => {
    const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10));
    return new Date(y, m - 1, d);
  };

  const formatDateDDMMYYYY = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatDateDDMM = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
  };

  const startOfWeekMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0=Dim .. 6=Sam
    const diffToMonday = (day + 6) % 7; // Monday->0, Sunday->6
    d.setDate(d.getDate() - diffToMonday);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const endOfWeekSunday = (date) => {
    const d = startOfWeekMonday(date);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  const startOfYear = (date) => new Date(date.getFullYear(), 0, 1);
  const endOfYear = (date) => new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);

  const daysInMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();

  const maxDate = (a, b) => (a.getTime() >= b.getTime() ? a : b);
  const minDate = (a, b) => (a.getTime() <= b.getTime() ? a : b);

  const diffDaysInclusive = (a, b) => {
    const ms = b.getTime() - a.getTime();
    return Math.floor(ms / 86400000) + 1;
  };

  const baseJan = monthlyData[0];
  const baseMay = monthlyData[monthlyData.length - 1];
  const monthlyTrendLeads = (baseMay.leads - baseJan.leads) / 4;
  const acceptedRateBase = baseMay.accepted / baseMay.leads;
  const eligibleRateBase = baseMay.eligible / baseMay.leads;
  const accordFinaleRateBase = baseMay.accordFinale / baseMay.leads;
  const baseSignatureTotal = monthlyData.reduce((sum, row) => sum + row.accordFinale, 0);

  const getMonthMetrics = (year, monthIndex) => {
    // Si on tombe sur les mois "reels" de la demo (Janv->Mai 2026), on utilise les valeurs fournies.
    if (year === baseYear && monthIndex >= 0 && monthIndex < monthlyData.length) {
      return monthlyData[monthIndex];
    }

    const yearFactor = 1 + (year - baseYear) * 0.06;
    const leads = Math.max(0, Math.round((baseJan.leads + monthlyTrendLeads * monthIndex) * yearFactor));
    return {
      month: monthLabelsFR[monthIndex],
      leads,
      accepted: Math.round(leads * acceptedRateBase),
      eligible: Math.round(leads * eligibleRateBase),
      accordFinale: Math.round(leads * accordFinaleRateBase),
    };
  };

  const getPeriodBins = (startISO, endISO, granularity) => {
    const start = parseISODate(startISO);
    start.setHours(0, 0, 0, 0);
    const end = parseISODate(endISO);
    end.setHours(23, 59, 59, 999);
    if (start.getTime() > end.getTime()) return [];

    if (granularity === 'weekly') {
      const bins = [];
      let cursor = startOfWeekMonday(start);
      while (cursor.getTime() <= end.getTime()) {
        const binStart = maxDate(cursor, start);
        const binEnd = minDate(endOfWeekSunday(cursor), end);
        bins.push({
          type: 'weekly',
          start: new Date(binStart),
          end: new Date(binEnd),
          label: `Du ${formatDateDDMM(binStart)} au ${formatDateDDMM(binEnd)}`,
          key: `w-${binStart.toISOString().slice(0, 10)}`,
        });
        cursor.setDate(cursor.getDate() + 7);
      }
      return bins;
    }

    if (granularity === 'yearly') {
      const bins = [];
      for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
        const monthStart = startOfYear(new Date(y, 0, 1));
        const monthEnd = endOfYear(new Date(y, 0, 1));
        const binStart = maxDate(monthStart, start);
        const binEnd = minDate(monthEnd, end);
        bins.push({
          type: 'yearly',
          start: new Date(binStart),
          end: new Date(binEnd),
          label: String(y),
          key: `y-${y}`,
        });
      }
      return bins;
    }

    // monthly
    const bins = [];
    let cursor = startOfMonth(start);
    const lastMonth = startOfMonth(end);
    while (cursor.getTime() <= lastMonth.getTime()) {
      const binStart = maxDate(cursor, start);
      const binEnd = minDate(endOfMonth(cursor), end);
      const labelBase = monthLabelsFR[cursor.getMonth()];
      const label =
        start.getFullYear() !== end.getFullYear() ? `${labelBase} ${cursor.getFullYear()}` : labelBase;
      bins.push({
        type: 'monthly',
        start: new Date(binStart),
        end: new Date(binEnd),
        label,
        key: `m-${cursor.getFullYear()}-${cursor.getMonth()}`,
      });
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
    return bins;
  };

  const getMetricsForBin = (bin) => {
    const binStart = bin.start;
    const binEnd = bin.end;
    let totals = { leads: 0, accepted: 0, eligible: 0, accordFinale: 0 };

    let cursor = new Date(binStart.getFullYear(), binStart.getMonth(), 1);
    const lastCursor = new Date(binEnd.getFullYear(), binEnd.getMonth(), 1);
    while (cursor.getTime() <= lastCursor.getTime()) {
      const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      const monthEnd = endOfMonth(monthStart);

      const overlapStart = maxDate(binStart, monthStart);
      const overlapEnd = minDate(binEnd, monthEnd);

      if (overlapStart.getTime() <= overlapEnd.getTime()) {
        const overlapDays = diffDaysInclusive(
          new Date(overlapStart.getFullYear(), overlapStart.getMonth(), overlapStart.getDate()),
          new Date(overlapEnd.getFullYear(), overlapEnd.getMonth(), overlapEnd.getDate())
        );
        const dim = daysInMonth(cursor.getFullYear(), cursor.getMonth());
        const ratio = overlapDays / dim;
        const monthMetrics = getMonthMetrics(cursor.getFullYear(), cursor.getMonth());

        totals.leads += monthMetrics.leads * ratio;
        totals.accepted += monthMetrics.accepted * ratio;
        totals.eligible += monthMetrics.eligible * ratio;
        totals.accordFinale += monthMetrics.accordFinale * ratio;
      }

      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }

    return {
      leads: Math.round(totals.leads),
      accepted: Math.round(totals.accepted),
      eligible: Math.round(totals.eligible),
      accordFinale: Math.round(totals.accordFinale),
    };
  };

  const periodBins = useMemo(() => getPeriodBins(startDate, endDate, periodGranularity), [startDate, endDate, periodGranularity]);
  const periodMetricsByBin = useMemo(() => periodBins.map((bin) => getMetricsForBin(bin)), [periodBins]);

  const periodTotals = useMemo(() => {
    const totals = { leads: 0, accepted: 0, eligible: 0, accordFinale: 0 };
    for (const m of periodMetricsByBin) {
      totals.leads += m.leads;
      totals.accepted += m.accepted;
      totals.eligible += m.eligible;
      totals.accordFinale += m.accordFinale;
    }
    return totals;
  }, [periodMetricsByBin]);

  const periodTauxAcceptation = periodTotals.leads > 0 ? ((periodTotals.accepted / periodTotals.leads) * 100).toFixed(1) : '0.0';
  const periodTauxEligibilite = periodTotals.accepted > 0 ? ((periodTotals.eligible / periodTotals.accepted) * 100).toFixed(1) : '0.0';
  const periodTauxTransformation = periodTotals.eligible > 0 ? ((periodTotals.accordFinale / periodTotals.eligible) * 100).toFixed(1) : '0.0';
  const periodTauxConversionGlobal = periodTotals.leads > 0 ? ((periodTotals.accordFinale / periodTotals.leads) * 100).toFixed(1) : '0.0';
  const periodTauxConversionGlobalNumber = parseFloat(periodTauxConversionGlobal) || 0;

  const toISODateLocal = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // ===== COMPARAISON PERIODE PRECEDENTE =====
  const prevPeriodDates = useMemo(() => {
    const start = parseISODate(startDate);
    const end = parseISODate(endDate);
    const durationDays = diffDaysInclusive(start, end);
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevEnd.getDate() - durationDays + 1);
    // Securite: ne renvoie pas une periode vide si dates invalides
    if (prevStart.getTime() > prevEnd.getTime()) return { prevStartISO: startDate, prevEndISO: endDate };
    return { prevStartISO: toISODateLocal(prevStart), prevEndISO: toISODateLocal(prevEnd) };
  }, [startDate, endDate]);

  const prevPeriodBins = useMemo(
    () => getPeriodBins(prevPeriodDates.prevStartISO, prevPeriodDates.prevEndISO, periodGranularity),
    [prevPeriodDates.prevStartISO, prevPeriodDates.prevEndISO, periodGranularity]
  );

  const prevPeriodMetricsByBin = useMemo(() => prevPeriodBins.map((bin) => getMetricsForBin(bin)), [prevPeriodBins]);

  const prevPeriodTotals = useMemo(() => {
    const totals = { leads: 0, accepted: 0, eligible: 0, accordFinale: 0 };
    for (const m of prevPeriodMetricsByBin) {
      totals.leads += m.leads;
      totals.accepted += m.accepted;
      totals.eligible += m.eligible;
      totals.accordFinale += m.accordFinale;
    }
    return totals;
  }, [prevPeriodMetricsByBin]);

  const prevRateConversionGlobal = prevPeriodTotals.leads > 0 ? (prevPeriodTotals.accordFinale / prevPeriodTotals.leads) * 100 : 0;
  const prevRateAcceptation = prevPeriodTotals.leads > 0 ? (prevPeriodTotals.accepted / prevPeriodTotals.leads) * 100 : 0;
  const prevRateEligibilite = prevPeriodTotals.accepted > 0 ? (prevPeriodTotals.eligible / prevPeriodTotals.accepted) * 100 : 0;
  const prevRateTransformation = prevPeriodTotals.eligible > 0 ? (prevPeriodTotals.accordFinale / prevPeriodTotals.eligible) * 100 : 0;

  const periodRateConversionGlobal = periodTotals.leads > 0 ? (periodTotals.accordFinale / periodTotals.leads) * 100 : 0;
  const periodRateAcceptation = periodTotals.leads > 0 ? (periodTotals.accepted / periodTotals.leads) * 100 : 0;
  const periodRateEligibilite = periodTotals.accepted > 0 ? (periodTotals.eligible / periodTotals.accepted) * 100 : 0;
  const periodRateTransformation = periodTotals.eligible > 0 ? (periodTotals.accordFinale / periodTotals.eligible) * 100 : 0;

  const buildSeverity = (deltaPoints, deltaRelative) => {
    // deltaPoints = current - previous (en points)
    if (deltaPoints <= -4) return 'critique';
    if (deltaPoints <= -2) return 'warning';
    if (deltaRelative != null) {
      if (deltaRelative <= -10) return 'critique';
      if (deltaRelative <= -6) return 'warning';
    }
    return null;
  };

  const conversionAlerts = useMemo(() => {
    // deltaRelative: variation relative vs periode precedente (%)
    const make = (key, title, curr, prev, color) => {
      const deltaPoints = curr - prev;
      const deltaRelative = prev > 0 ? ((curr - prev) / prev) * 100 : null;
      const severity = buildSeverity(deltaPoints, deltaRelative);
      if (!severity) return null;
      return {
        key,
        title,
        severity,
        color,
        prev,
        curr,
        deltaPoints,
        deltaRelative,
      };
    };

    return [
      make(
        'conversion',
        'Conversion (Accord Finale / Leads)',
        periodRateConversionGlobal,
        prevRateConversionGlobal,
        '#10b981'
      ),
      make(
        'acceptation',
        'Taux Acceptation (Acceptes / Leads)',
        periodRateAcceptation,
        prevRateAcceptation,
        '#8b5cf6'
      ),
      make(
        'eligibilite',
        'Taux Eligibilite (Eligibles / Acceptes)',
        periodRateEligibilite,
        prevRateEligibilite,
        '#06b6d4'
      ),
      make(
        'transformation',
        'Taux Transformation (Accord Finale / Eligibles)',
        periodRateTransformation,
        prevRateTransformation,
        '#22c55e'
      ),
    ].filter(Boolean);
  }, [
    periodRateConversionGlobal,
    prevRateConversionGlobal,
    periodRateAcceptation,
    prevRateAcceptation,
    periodRateEligibilite,
    prevRateEligibilite,
    periodRateTransformation,
    prevRateTransformation
  ]);

  const funnelData = useMemo(() => {
    if (periodTotals.leads <= 0) return [];
    return [
      { etape: 'Light Application', volume: periodTotals.leads, percent: 100 },
      { etape: 'Easy Lead (Acceptes)', volume: periodTotals.accepted, percent: ((periodTotals.accepted / periodTotals.leads) * 100).toFixed(1) },
      { etape: 'Easy Connect (Eligibles)', volume: periodTotals.eligible, percent: ((periodTotals.eligible / periodTotals.leads) * 100).toFixed(1) },
      { etape: 'Easy Partner (Accord final)', volume: periodTotals.accordFinale, percent: ((periodTotals.accordFinale / periodTotals.leads) * 100).toFixed(1) },
    ];
  }, [periodTotals]);

  const periodCommissionsData = useMemo(() => {
    const scale = baseSignatureTotal > 0 ? periodTotals.accordFinale / baseSignatureTotal : 1;
    return [
      { status: 'Encaissees', amount: Math.round(commissionsData[0].amount * scale), color: commissionsData[0].color },
      { status: 'En Attente', amount: Math.round(commissionsData[1].amount * scale), color: commissionsData[1].color },
    ];
  }, [periodTotals, baseSignatureTotal]);

  // ===== Selecteur de periode global =====
  const renderPeriodSelector = () => (
    <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Période</h3>
        <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '600' }}>
          {formatDateDDMMYYYY(parseISODate(startDate))} {'->'} {formatDateDDMMYYYY(parseISODate(endDate))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <p style={{ color: '#475569', fontSize: '11px', fontWeight: '600', margin: '0 0 6px 0' }}>Date début</p>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              const next = e.target.value;
              setStartDate(next);
              if (next && endDate && next > endDate) setEndDate(next);
            }}
            style={{ padding: '8px 10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', color: '#0f172a' }}
          />
        </div>

        <div>
          <p style={{ color: '#475569', fontSize: '11px', fontWeight: '600', margin: '0 0 6px 0' }}>Date fin</p>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '8px 10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', color: '#0f172a' }}
          />
        </div>

        <div>
          <p style={{ color: '#475569', fontSize: '11px', fontWeight: '600', margin: '0 0 6px 0' }}>Granularité</p>
          <select
            value={periodGranularity}
            onChange={(e) => setPeriodGranularity(e.target.value)}
            style={{ padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: '700', color: '#0f172a', backgroundColor: '#fff' }}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

    </div>
  );

  // ===== DONNEES EXECUTIVES (VARIABLES) =====
  const executiveData = useMemo(() => {
    // Parser les dates sélectionnées
    const [startY, startM, startD] = startDate.split('-').map(Number);
    const [endY, endM, endD] = endDate.split('-').map(Number);
    const start = new Date(startY, startM - 1, startD);
    const end = new Date(endY, endM - 1, endD);
    
    // Calculer un seed basé sur les dates sélectionnées
    const dateSeed = start.getTime() + end.getTime();
    const monthName = start.toLocaleString('fr-FR', { month: 'long' });
    const yearName = start.getFullYear();
    
    // Fonction pour faire varier les valeurs selon les dates
    const vary = (base, variance, seedOffset) => {
      const seed = (dateSeed / 10000000) + seedOffset;
      const random = Math.sin(seed) * 10000;
      const factor = (random - Math.floor(random)) - 0.3; // bias vers positif
      return base + (variance * factor);
    };
    
    // Utilisateurs
    const utilisateursTotaux = Math.round(vary(1200, 300, 1));
    const utilisateursActifs = vary(8.5, 3, 2);
    // Demandes
    const demandesTotales = Math.round(vary(3900, 1000, 3));
    const demandesVariation = vary(12.3, 5, 4);
    // Partenaires
    const partenairesActifs = Math.round(vary(156, 30, 5));
    const partenairesVariation = vary(2.1, 1.5, 6);
    // Services
    const servicesDisponibles = Math.round(vary(9, 3, 7));
    const servicesActifs = vary(0, 15, 8);
    // Crédits
    const creditsApprouves = vary(15.7, 5, 9);
    // Offres
    const offresTotales = Math.round(vary(2200, 500, 10));
    const offresGenerees = vary(9.2, 4, 11);
    // RDV
    const rdvProgrammes = Math.round(vary(67, 20, 12));
    const rdvEnAttente = vary(5.4, 3, 13);
    // Offres acceptées
    const offresAcceptees = vary(3.2, 2, 14);
    
    // Services demandés (variables selon les dates)
    const servicesDemandes = [
      { name: 'Crédit Conso', value: vary(32, 8, 15), color: '#ef4444' },
      { name: 'Crédit Auto', value: vary(23, 6, 16), color: '#3b82f6' },
      { name: 'Crédit Immo', value: vary(15, 5, 17), color: '#10b981' },
      { name: 'Leasing Auto', value: vary(11, 4, 18), color: '#f59e0b' },
      { name: 'Leasing Immo', value: vary(6, 3, 19), color: '#8b5cf6' },
      { name: 'Leasing Équipement', value: vary(4, 2, 20), color: '#06b6d4' },
      { name: 'Banc Assurance', value: vary(6, 3, 21), color: '#ec4899' },
      { name: 'Avance Salaire', value: vary(3, 2, 22), color: '#14b8a6' },
    ];
    
    return {
      dateLabel: `${monthName} ${yearName}`,
      utilisateursTotaux: utilisateursTotaux >= 1000 ? `${(utilisateursTotaux / 1000).toFixed(1)}K` : utilisateursTotaux,
      utilisateursTotauxRaw: utilisateursTotaux,
      utilisateursActifs: `${utilisateursActifs.toFixed(1)}%`,
      utilisateursActifsRaw: utilisateursActifs,
      demandesTotales: demandesTotales >= 1000 ? `${(demandesTotales / 1000).toFixed(1)}K` : demandesTotales,
      demandesTotalesRaw: demandesTotales,
      demandesVariation: `${demandesVariation.toFixed(1)}%`,
      demandesVariationRaw: demandesVariation,
      partenairesActifs,
      partenairesVariation: `${partenairesVariation.toFixed(1)}%`,
      partenairesVariationRaw: partenairesVariation,
      servicesDisponibles,
      servicesActifs: `${servicesActifs.toFixed(0)}%`,
      servicesActifsRaw: servicesActifs,
      creditsApprouves: `${creditsApprouves.toFixed(1)}%`,
      creditsApprouvesRaw: creditsApprouves,
      offresTotales: offresTotales >= 1000 ? `${(offresTotales / 1000).toFixed(1)}K` : offresTotales,
      offresTotalesRaw: offresTotales,
      offresGenerees: `${offresGenerees.toFixed(1)}%`,
      offresGenereesRaw: offresGenerees,
      rdvProgrammes,
      rdvEnAttente: `${rdvEnAttente.toFixed(1)}%`,
      rdvEnAttenteRaw: rdvEnAttente,
      offresAcceptees: `${offresAcceptees.toFixed(1)}%`,
      offresAccepteesRaw: offresAcceptees,
      servicesDemandes: servicesDemandes.map(s => ({
        ...s,
        value: s.value,
        displayValue: `${s.value.toFixed(1)}%`
      })),
    };
  }, [startDate, endDate]);

  // ===== VUE EXECUTIVE =====
  const renderExecutive = () => (
    <div style={{ marginTop: '12px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Building2 size={24} color="#ef4444" /> Vue Executive - {executiveData.dateLabel}
      </h2>
       
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '18px' }}>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #ef4444' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Utilisateurs totaux</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444', margin: '8px 0' }}>{executiveData.utilisateursTotaux}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Total inscrits</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #10b981' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Utilisateurs actifs</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', margin: '8px 0' }}>{executiveData.utilisateursActifs}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>{executiveData.dateLabel}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #06b6d4' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Demandes</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#06b6d4', margin: '8px 0' }}>{executiveData.demandesVariation}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>{executiveData.dateLabel}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #ec4899' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Partenaires</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ec4899', margin: '8px 0' }}>{executiveData.partenairesVariation}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>{executiveData.dateLabel}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #6366f1' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Services</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#6366f1', margin: '8px 0' }}>{executiveData.servicesActifs}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>{executiveData.dateLabel}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #14b8a6' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Crédits approuvés</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#14b8a6', margin: '8px 0' }}>{executiveData.creditsApprouves}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>{executiveData.dateLabel}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #84cc16' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Offres</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#84cc16', margin: '8px 0' }}>{executiveData.offresGenerees}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>{executiveData.dateLabel}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #a855f7' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>RDV</p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#a855f7', margin: '8px 0' }}>{executiveData.rdvEnAttente}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Cette semaine</p>
        </div>
      </div>

      {/* ===== SERVICES DEMANDÉS ===== */}
      <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="#8b5cf6" /> Services Demandés - {executiveData.dateLabel}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Graphique en secteurs */}
          <div style={{ minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={executiveData.servicesDemandes}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${value.toFixed(1)}%`}
                  labelLine={true}
                >
                  {executiveData.servicesDemandes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Barres de progression */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {executiveData.servicesDemandes.map((service, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '130px', fontSize: '12px', color: '#475569', fontWeight: '500' }}>{service.name}</div>
                <div style={{ flex: 1, height: '18px', backgroundColor: '#f1f5f9', borderRadius: '9px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ 
                    width: `${service.value}%`, 
                    height: '100%', 
                    backgroundColor: service.color, 
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '6px'
                  }}>
                    <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600' }}>{service.displayValue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>Entonnoir EasyBank   </h3>

        {(() => {
          const leads = periodTotals.leads;
          const accepted = periodTotals.accepted;
          const eligible = periodTotals.eligible;
          const accordFinale = periodTotals.accordFinale;

          const rateAcceptation = leads > 0 ? (accepted / leads) * 100 : 0;
          const rateEligibilite = accepted > 0 ? (eligible / accepted) * 100 : 0;
          const rateTransformation = eligible > 0 ? (accordFinale / eligible) * 100 : 0;

          const cumLight = 100;
          const cumEasyLead = leads > 0 ? (accepted / leads) * 100 : 0;
          const cumEasyConnect = leads > 0 ? (eligible / leads) * 100 : 0;
          const cumEasyPartner = leads > 0 ? (accordFinale / leads) * 100 : 0;

          const steps = [
            {
              key: 'light',
              title: 'Light Application',
              color: '#ef4444',
              volume: leads,
              cum: cumLight,
              desc: 'Page d\'accueil -> Formulaire multi etapes -> Prequalification (scoring) -> Lead qualifie ? -> Transmission vers Easy Lead.',
              extra: `Taux = 100% (base des leads)`
            },
            {
              key: 'lead',
              title: 'Easy Lead',
              color: '#8b5cf6',
              volume: accepted,
              cum: cumEasyLead,
              desc: 'Qualification Admin : Statut Accepte / Ineligible temporaire (relance documents) -> Recherche solution alternative.',
              extra: `Taux d'acceptation = ${rateAcceptation.toFixed(1)}%`
            },
            {
              key: 'connect',
              title: 'Easy Connect',
              color: '#06b6d4',
              volume: eligible,
              cum: cumEasyConnect,
              desc: 'EasyConnect (Admin + Espace Client) : analyse docs -> envoi identifiants -> coffre-fort numerique -> upload dossier complet -> Client eligible ?',
              extra: `Taux d'eligibilite = ${rateEligibilite.toFixed(1)}%`
            },
            {
              key: 'partner',
              title: 'Easy Partner',
              color: '#10b981',
              volume: accordFinale,
              cum: cumEasyPartner,
              desc: 'Transmission banques partenaires -> negociation & etude de faisabilite -> accord credit recu -> appel client -> demande commission 2% -> paiement commission ? -> signature.',
              extra: `Taux de transformation = ${rateTransformation.toFixed(1)}%`
            },
          ];

          const maxVolume = Math.max(1, leads);

          return (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {steps.map((s, idx) => {
                  const rel = s.volume / maxVolume; // 0..1
                  const widthPct = Math.max(22, Math.min(100, 100 * rel));
                  return (
                    <div key={s.key} style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: `${widthPct}%`, transition: 'width 0.35s ease' }}>
                        <div
                          style={{
                            backgroundColor: '#f1f5f9',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)'
                          }}
                        >
                          <div
                            style={{
                              height: '14px',
                              borderRadius: '999px',
                              backgroundColor: s.color,
                              opacity: 0.95,
                              clipPath: 'polygon(0% 0%, 100% 0%, 92% 100%, 8% 100%)'
                            }}
                          />

                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '8px', alignItems: 'center' }}>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a', margin: 0 }}>{idx + 1}. {s.title}</p>
                              <p style={{ fontSize: '10.5px', color: '#475569', margin: '3px 0 0 0' }}>{s.desc}</p>
                            </div>
                            <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                              <p style={{ fontSize: '12px', fontWeight: '900', color: s.color, margin: 0 }}>{s.volume} dossiers</p>
                              <p style={{ fontSize: '11px', fontWeight: '800', color: '#0f172a', margin: '3px 0 0 0' }}>{s.cum.toFixed(1)}%</p>
                              <p style={{ fontSize: '10px', color: '#64748b', margin: '2px 0 0 0', fontWeight: '600' }}>{s.extra}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );

  // ===== VUE OPERATIONNELLE =====
  const renderOperational = () => (
    <div style={{ marginTop: '12px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Gauge size={24} color="#8b5cf6" /> Vue Opérationnelle
      </h2>
       
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #10b981' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>Approuvé</p>
          <p style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{periodTauxAcceptation}%</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #ef4444' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>Rejeté</p>
          <p style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{(100 - parseFloat(periodTauxAcceptation)).toFixed(1)}%</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #06b6d4' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>Terminé</p>
          <p style={{ color: '#06b6d4', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{periodTauxConversionGlobal}%</p>
        </div>
      </div>
       
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>Délai par étape (h)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px', borderLeft: '4px solid #ef4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: '12px', fontWeight: '600' }}>Light Application</span>
              <span style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold' }}>{kpis.delaiLightApplication}h</span>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f3e8ff', borderRadius: '8px', borderLeft: '4px solid #8b5cf6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: '12px', fontWeight: '600' }}>Easy Lead - Accepté</span>
              <span style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 'bold' }}>{kpis.delaiEasyLead}h</span>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: '12px', fontWeight: '600' }}>Easy Lead - Inéligible</span>
              <span style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold' }}>{Math.round(kpis.delaiEasyLead * 0.7)}h</span>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#fae8ff', borderRadius: '8px', borderLeft: '4px solid #d946ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: '12px', fontWeight: '600' }}>Easy Lead - Recherche Alt.</span>
              <span style={{ color: '#d946ef', fontSize: '18px', fontWeight: 'bold' }}>{Math.round(kpis.delaiEasyLead * 0.5)}h</span>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#ecfeff', borderRadius: '8px', borderLeft: '4px solid #06b6d4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: '12px', fontWeight: '600' }}>Easy Connect</span>
              <span style={{ color: '#06b6d4', fontSize: '18px', fontWeight: 'bold' }}>{kpis.delaiEasyConnect}h</span>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#ecfdf5', borderRadius: '8px', borderLeft: '4px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: '12px', fontWeight: '600' }}>Easy Partner</span>
              <span style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold' }}>{kpis.delaiEasyPartner}h</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>Répartition</h3>
          {(() => {
            const approved = periodTotals.accepted;
            const rejected = periodTotals.leads - periodTotals.accepted;
            const finished = periodTotals.accordFinale;
            const statusData = [
              { name: 'Approuvé', value: approved, color: '#10b981' },
              { name: 'Rejeté', value: rejected, color: '#ef4444' },
              { name: 'Terminé', value: finished, color: '#06b6d4' },
            ];
            return (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '5px', flexWrap: 'wrap' }}>
                  {statusData.map((entry, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color }} />
                      <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>

    </div>
  );

  // ===== VUE ALERTES =====
  const renderAlerts = () => {
    const hasAlerts = conversionAlerts && conversionAlerts.length > 0;
    return (
      <div style={{ marginTop: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={24} color="#f59e0b" /> Système d'alertes
        </h2>

        {!hasAlerts ? (
          <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '600' }}>
              Aucune alerte pour la période sélectionnée.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {conversionAlerts.map((a) => {
              const isCritical = a.severity === 'critique';
              const badgeColor = isCritical ? '#ef4444' : '#f59e0b';
              const recommendation =
                a.key === 'conversion'
                  ? "Bottleneck probable sur tout le funnel. Priorite : verifier Acceptation -> Eligibilite -> Transformation et l'evolution des volumes."
                  : a.key === 'acceptation'
                    ? "Revoir les regles de qualification (scoring) et les motifs de rejet/temporaire. Relancer immediatement les dossiers incomplets."
                    : a.key === 'eligibilite'
                      ? "Verifier la qualite des documents et l'etude de dossier (criteres underwriting). Lancer un controle de coherence des pieces."
                      : "Controler le pipeline banques + statuts de commission (2%) et la communication client. S'assurer que les etapes de signature sont en place.";
              return (
                <div
                  key={a.key}
                  style={{
                    backgroundColor: '#fff',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    borderLeft: `4px solid ${a.color}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                    <p style={{ color: '#0f172a', fontSize: '12px', margin: 0, fontWeight: '800' }}>{a.title}</p>
                    <span
                      style={{
                        backgroundColor: badgeColor,
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '6px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      {a.severity === 'critique' ? 'CRITIQUE' : 'ALERTE'}
                    </span>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>
                      Avant: {a.prev.toFixed(1)}% {'->'} Maintenant: {a.curr.toFixed(1)}%
                    </p>
                    <p style={{ color: a.color, fontSize: '14px', fontWeight: '900', margin: '6px 0 0 0' }}>
                      Delta {a.deltaPoints.toFixed(1)} pts ({a.deltaRelative.toFixed(1)}%)
                    </p>
                    <p style={{ color: '#0f172a', fontSize: '11px', margin: '8px 0 0 0', fontWeight: '800' }}>
                      Recommendation : <span style={{ color: '#475569', fontWeight: '700' }}>{recommendation}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ===== VUE CONVERSION =====
  const renderConversion = () => (
    <div style={{ marginTop: '12px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ChartIcon size={24} color="#06b6d4" /> Vue Conversion
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #ef4444' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>Periode - Leads</p>
          <p style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{periodTotals.leads}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #8b5cf6' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>Periode - Acceptes</p>
          <p style={{ color: '#8b5cf6', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{periodTotals.accepted}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '12px 14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #06b6d4' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>Periode - Easy Partner</p>
          <p style={{ color: '#06b6d4', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{periodTotals.accordFinale}</p>
        </div>
        <div
          style={{
            backgroundColor: '#fff',
            padding: '12px 14px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            borderTop: '4px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontWeight: '600' }}>Période - Taux de conversion</p>
            <p style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold', margin: '6px 0 0 0' }}>{periodTauxConversionGlobal}%</p>
          </div>
          <div style={{ width: '64px', height: '64px', flex: '0 0 auto' }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - Math.max(0, Math.min(100, periodTauxConversionGlobalNumber)) / 100)}`}
              />
            </svg>
          </div>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>
          Performance par {periodGranularity === 'weekly' ? 'Semaine' : periodGranularity === 'yearly' ? 'Année' : 'Mois'}
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#475569' }}>
                  {periodGranularity === 'weekly' ? 'Semaine' : periodGranularity === 'yearly' ? 'Année' : 'Mois'}
                </th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Leads</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Acceptés</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>% Conv</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Eligibles</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>Accord Finale</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: '600', color: '#475569' }}>% Final</th>
              </tr>
            </thead>
            <tbody>
              {periodBins.map((bin, idx) => {
                const row = periodMetricsByBin[idx];
                const convPercent = row.leads > 0 ? ((row.accepted / row.leads) * 100).toFixed(1) : '0.0';
                const finalPercent = row.leads > 0 ? ((row.accordFinale / row.leads) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>{bin.label}</td>
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
    </div>
  );

  // ===== VUE FINANCE =====
  const renderFinance = () => (
    <div style={{ marginTop: '12px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Wallet size={24} color="#22c55e" /> Vue Finance
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #22c55e' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Période - Leads entrants</p>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#22c55e', margin: '8px 0' }}>{periodTotals.leads}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Leads entrants</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '14px 16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #f59e0b' }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontWeight: '600' }}>Période - Accord finale</p>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#f59e0b', margin: '8px 0' }}>{periodTotals.accordFinale}</div>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Accord finale</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>Répartition Commissions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={periodCommissionsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="amount"
                nameKey="status"
              >
                {periodCommissionsData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => {
                const total = periodCommissionsData.reduce((sum, item) => sum + item.amount, 0);
                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${percent}%`;
              }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
            {periodCommissionsData.map((entry, idx) => {
              const total = periodCommissionsData.reduce((sum, item) => sum + item.amount, 0);
              const percent = total > 0 ? ((entry.amount / total) * 100).toFixed(1) : 0;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: entry.color }} />
                  <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>{entry.status}: {percent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>Taux de Concrétisation</h3>
          {(() => {
            const tauxConversion = parseFloat(periodTauxConversionGlobal);
            const tauxNonConversion = 100 - tauxConversion;
            const concretisationData = [
              { status: 'Convertis', amount: tauxConversion, color: '#10b981' },
              { status: 'Non Convertis', amount: tauxNonConversion, color: '#ef4444' },
            ];
            return (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={concretisationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                      nameKey="status"
                    >
                      {concretisationData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                  {concretisationData.map((entry, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: entry.color }} />
                      <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>{entry.status}: {entry.amount.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
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
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={32} /> GENERAL DASHBOARD
            </h1>
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
        {renderPeriodSelector()}
        {renderExecutive()}
        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px dashed #e2e8f0' }} />
        {renderOperational()}
        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px dashed #e2e8f0' }} />
        {renderAlerts()}
        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px dashed #e2e8f0' }} />
        {renderConversion()}
        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px dashed #e2e8f0' }} />
        {renderFinance()}
      </div>

      <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '14px 24px', marginTop: '24px', textAlign: 'center', fontSize: '11px' }}>
        <p style={{ margin: 0 }}>EASY-FINANCE v3.0 | Formules: Conversion = Easy Partner/Leads | Encaissement = Commission payee/Commission totale | (c) EasyBank 2026</p>
      </div>
    </div>
  );
}
