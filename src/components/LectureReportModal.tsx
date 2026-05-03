'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, type Student, type Lecture } from '@/contexts/StoreContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useTheme } from '@/contexts/ThemeContext';

interface LectureReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: Lecture;
}

export default function LectureReportModal({ isOpen, onClose, lecture }: LectureReportModalProps) {
  const { state } = useStore();
  const { locale } = useLocale();
  const { theme } = useTheme();
  const reportRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';
  // Palette — mirrors globals.css variables
  const p = isDark ? {
    bg:        '#060B14',
    surface:   '#0D1824',
    surface2:  '#142035',
    border:    '#1e3a2f',
    text:      '#F0F6FF',
    textMuted: '#5A7A99',
    accent:    '#00E8A2',
    accentEnd: '#00C87A',
    danger:    '#FF4D6A',
    // stat card tints
    presentBg:    '#0a2e20',
    presentBorder:'#00c87a',
    presentNum:   '#00E8A2',
    absentBg:     '#2e0a14',
    absentBorder: '#ff4d6a',
    absentNum:    '#FF4D6A',
    rateBg:       '#142035',
    rateBorder:   '#1e3a2f',
    rowPresentBorder: '#1a3d2b',
    rowAbsentBorder:  '#3d1a24',
    pillPresent: '#00e8a220',
    pillPresentText: '#00E8A2',
    pillAbsent: '#ff4d6a20',
    pillAbsentText: '#FF4D6A',
    footerBorder: '#1e3a2f',
    thBg: '#0D1824',
  } : {
    bg:        '#F0F6FF',
    surface:   '#FFFFFF',
    surface2:  '#E2E8F0',
    border:    '#e2e8f0',
    text:      '#0f172a',
    textMuted: '#94a3b8',
    accent:    '#00c87a',
    accentEnd: '#00E8A2',
    danger:    '#e11d48',
    presentBg:    '#d1fae5',
    presentBorder:'#6ee7b7',
    presentNum:   '#065f46',
    absentBg:     '#fee2e2',
    absentBorder: '#fca5a5',
    absentNum:    '#991b1b',
    rateBg:       '#f1f5f9',
    rateBorder:   '#e2e8f0',
    rowPresentBorder: '#e5f0e8',
    rowAbsentBorder:  '#fce7e7',
    pillPresent: '#d1fae5',
    pillPresentText: '#065f46',
    pillAbsent: '#fee2e2',
    pillAbsentText: '#991b1b',
    footerBorder: '#e2e8f0',
    thBg: '#f8fafc',
  };

  const attendingStudents = lecture.attendees
    .map(uid => state.students.find(s => s.uid === uid))
    .filter((s): s is Student => s !== undefined);

  const absentStudents = state.students.filter(
    s => !lecture.attendees.includes(s.uid)
  );

  const total = state.students.length;
  const attending = attendingStudents.length;
  const absent = absentStudents.length;
  const percentage = total > 0 ? Math.round((attending / total) * 100) : 0;

  const startTime = new Date(lecture.startedAt);
  const endTime = lecture.endedAt ? new Date(lecture.endedAt) : new Date();
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationMins = Math.round(durationMs / 60000);
  const durationStr = durationMins >= 60
    ? `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`
    : `${durationMins}m`;

  const lectureName = locale === 'ar' ? lecture.nameAR : lecture.name;

  const handlePrint = () => {
    const presentRows = attendingStudents.map((s, i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid ${p.rowPresentBorder};color:${p.textMuted};font-size:13px;">${i + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid ${p.rowPresentBorder};font-weight:600;font-size:14px;color:${p.text};">${locale === 'ar' ? s.nameAR : s.nameEN}</td>
        <td style="padding:8px 12px;border-bottom:1px solid ${p.rowPresentBorder};font-family:monospace;font-size:13px;color:${p.textMuted};">${s.id}</td>
        <td style="padding:8px 12px;border-bottom:1px solid ${p.rowPresentBorder};text-align:center;">
          <span style="background:${p.pillPresent};color:${p.pillPresentText};font-weight:700;font-size:11px;padding:2px 10px;border-radius:999px;">Present</span>
        </td>
      </tr>`).join('');

    const absentRows = absentStudents.map((s, i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid ${p.rowAbsentBorder};color:${p.textMuted};font-size:13px;">${i + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid ${p.rowAbsentBorder};font-weight:600;font-size:14px;color:${p.text};">${locale === 'ar' ? s.nameAR : s.nameEN}</td>
        <td style="padding:8px 12px;border-bottom:1px solid ${p.rowAbsentBorder};font-family:monospace;font-size:13px;color:${p.textMuted};">${s.id}</td>
        <td style="padding:8px 12px;border-bottom:1px solid ${p.rowAbsentBorder};text-align:center;">
          <span style="background:${p.pillAbsent};color:${p.pillAbsentText};font-weight:700;font-size:11px;padding:2px 10px;border-radius:999px;">Absent</span>
        </td>
      </tr>`).join('');

    const barColor = percentage >= 75 ? '#00c87a' : percentage >= 50 ? '#d97706' : '#e11d48';

    const html = `<!DOCTYPE html>
<html lang="en" dir="${locale === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8" />
  <title>Lecture Report – ${lectureName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Cairo:wght@400;700;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    html, body { width: 100%; min-height: 100vh; background: ${p.bg}; }
    body { font-family: ${locale === 'ar' ? "'Cairo'" : "'Inter'"}, sans-serif; color: ${p.text}; font-size: 14px; padding: 32px 40px; margin: 0; }
    @page { size: auto; margin: 0mm; }

    .header { background: linear-gradient(135deg, ${p.accentEnd} 0%, ${p.accent} 100%); padding: 28px 40px; border-radius: 12px; margin-bottom: 24px; }
    .header-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(6,11,20,0.55); margin-bottom: 6px; }
    .header-title { font-size: 28px; font-weight: 900; color: #060b14; }
    .header-sub { font-size: 13px; color: rgba(6,11,20,0.55); margin-top: 4px; }

    .meta-row { display: flex; gap: 16px; margin-bottom: 24px; }
    .meta-card { flex: 1; background: ${p.surface}; border: 1px solid ${p.border}; border-radius: 12px; padding: 14px 16px; }
    .meta-card .label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${p.textMuted}; margin-bottom: 4px; }
    .meta-card .value { font-size: 16px; font-weight: 700; color: ${p.text}; }
    .meta-card .sub { font-size: 11px; color: ${p.textMuted}; }

    .stats-row { display: flex; gap: 16px; margin-bottom: 24px; }
    .stat { flex: 1; border-radius: 12px; padding: 18px; text-align: center; }
    .stat.present { background: ${p.presentBg}; border: 1.5px solid ${p.presentBorder}; }
    .stat.absent { background: ${p.absentBg}; border: 1.5px solid ${p.absentBorder}; }
    .stat.rate { background: ${p.rateBg}; border: 1.5px solid ${p.rateBorder}; }
    .stat-num { font-size: 32px; font-weight: 900; }
    .stat.present .stat-num { color: ${p.presentNum}; }
    .stat.absent .stat-num { color: ${p.absentNum}; }
    .stat.rate .stat-num { color: ${p.text}; }
    .stat-label { font-size: 12px; font-weight: 700; margin-top: 4px; color: ${p.textMuted}; text-transform: uppercase; letter-spacing: 1px; }

    .progress-wrap { margin-bottom: 28px; }
    .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: ${p.textMuted}; margin-bottom: 6px; font-weight: 600; }
    .progress-bar { height: 10px; background: ${p.surface2}; border-radius: 999px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 999px; background: ${barColor}; width: ${percentage}%; }

    .section-title { font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid; }
    .section-title.present { color: ${p.presentNum}; border-color: ${p.presentBorder}; }
    .section-title.absent { color: ${p.absentNum}; border-color: ${p.absentBorder}; margin-top: 24px; }

    table { width: 100%; border-collapse: collapse; }
    th { padding: 8px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; text-align: left; color: ${p.textMuted}; background: ${p.thBg}; }
    tr:last-child td { border-bottom: none !important; }

    .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid ${p.footerBorder}; display: flex; justify-content: space-between; align-items: center; }
    .footer-brand { font-size: 12px; font-weight: 800; color: ${p.accent}; letter-spacing: 1px; }
    .footer-time { font-size: 11px; color: ${p.textMuted}; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-label">Lecture Report · Hodor RFID System</div>
    <div class="header-title">${lectureName}</div>
    <div class="header-sub">Generated on ${new Date().toLocaleString(locale)}</div>
  </div>

  <div class="meta-row">
    <div class="meta-card">
      <div class="label">Started</div>
      <div class="value">${startTime.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</div>
      <div class="sub">${startTime.toLocaleDateString(locale)}</div>
    </div>
    <div class="meta-card">
      <div class="label">Finished</div>
      <div class="value">${endTime.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</div>
      <div class="sub">${endTime.toLocaleDateString(locale)}</div>
    </div>
    <div class="meta-card">
      <div class="label">Duration</div>
      <div class="value">${durationStr}</div>
      <div class="sub">&nbsp;</div>
    </div>
  </div>

  <div class="stats-row">
    <div class="stat present"><div class="stat-num">${attending}</div><div class="stat-label">Present</div></div>
    <div class="stat absent"><div class="stat-num">${absent}</div><div class="stat-label">Absent</div></div>
    <div class="stat rate"><div class="stat-num" style="color:${barColor}">${percentage}%</div><div class="stat-label">Attendance</div></div>
  </div>

  <div class="progress-wrap">
    <div class="progress-label"><span>Attendance Rate</span><span>${attending} / ${total} students</span></div>
    <div class="progress-bar"><div class="progress-fill"></div></div>
  </div>

  ${attendingStudents.length > 0 ? `
  <div class="section-title present">✓ Present Students (${attending})</div>
  <table>
    <thead><tr><th>#</th><th>Name</th><th>ID</th><th>Status</th></tr></thead>
    <tbody>${presentRows}</tbody>
  </table>` : ''}

  ${absentStudents.length > 0 ? `
  <div class="section-title absent">✗ Absent Students (${absent})</div>
  <table>
    <thead><tr><th>#</th><th>Name</th><th>ID</th><th>Status</th></tr></thead>
    <tbody>${absentRows}</tbody>
  </table>` : ''}

  <div class="footer">
    <div class="footer-brand">HODOR · by Devora</div>
    <div class="footer-time">Printed ${new Date().toLocaleString(locale)}</div>
  </div>
</body>
</html>`;

    const iframe = document.createElement('iframe');
    // Give the iframe actual dimensions so print viewport calculations are accurate, but keep it hidden
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;opacity:0;pointer-events:none;z-index:-9999;';
    document.body.appendChild(iframe);
    iframe.contentDocument!.open();
    iframe.contentDocument!.write(html);
    iframe.contentDocument!.close();

    // Wait for fonts/images then print
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow!.focus();
        iframe.contentWindow!.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 500);
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden-wrapper">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm print:hidden"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden print:hidden"
          >
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-accent to-accent-2 px-6 py-5 flex justify-between items-center">
              <div>
                <p className="text-bg/70 text-sm font-medium uppercase tracking-widest">Lecture Report</p>
                <h2 className="text-2xl font-black text-bg">{lectureName}</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 bg-bg/10 hover:bg-bg/20 text-bg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Meta */}
              <div className="grid grid-cols-3 gap-3 text-sm text-text-muted">
                <div className="rounded-xl bg-surface-2 p-3 border border-border">
                  <p className="text-xs uppercase tracking-wider mb-1 font-semibold">Started</p>
                  <p className="font-bold text-text">{startTime.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-xs">{startTime.toLocaleDateString(locale)}</p>
                </div>
                <div className="rounded-xl bg-surface-2 p-3 border border-border">
                  <p className="text-xs uppercase tracking-wider mb-1 font-semibold">Finished</p>
                  <p className="font-bold text-text">{endTime.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-xs">{endTime.toLocaleDateString(locale)}</p>
                </div>
                <div className="rounded-xl bg-surface-2 p-3 border border-border">
                  <p className="text-xs uppercase tracking-wider mb-1 font-semibold">Duration</p>
                  <p className="font-bold text-text text-lg">{durationStr}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-accent/10 border border-accent/20 p-4 text-center">
                  <p className="text-3xl font-black text-accent">{attending}</p>
                  <p className="text-sm font-semibold text-text-muted mt-1">Present</p>
                </div>
                <div className="rounded-2xl bg-danger/10 border border-danger/20 p-4 text-center">
                  <p className="text-3xl font-black text-danger">{absent}</p>
                  <p className="text-sm font-semibold text-text-muted mt-1">Absent</p>
                </div>
                <div className="rounded-2xl bg-surface-2 border border-border p-4 text-center">
                  <p className={`text-3xl font-black ${percentage >= 75 ? 'text-accent' : percentage >= 50 ? 'text-warning' : 'text-danger'}`}>{percentage}%</p>
                  <p className="text-sm font-semibold text-text-muted mt-1">Attendance</p>
                </div>
              </div>

              {/* Attendance Bar */}
              <div>
                <div className="flex justify-between text-xs text-text-muted mb-2">
                  <span>Attendance Rate</span>
                  <span>{attending}/{total} students</span>
                </div>
                <div className="h-3 rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Present Students */}
              {attendingStudents.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-accent" />
                    Present ({attending})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {attendingStudents.map((s, i) => (
                      <div key={s.uid} className="flex items-center gap-3 rounded-xl bg-accent/5 border border-accent/15 px-3 py-2">
                        <span className="text-xs text-text-muted font-mono w-6">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text text-sm truncate">{locale === 'ar' ? s.nameAR : s.nameEN}</p>
                          <p className="text-xs text-text-muted font-mono">{s.id}</p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-accent bg-accent/10 rounded-full px-2 py-0.5">✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Absent Students */}
              {absentStudents.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-danger uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-danger" />
                    Absent ({absent})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {absentStudents.map((s, i) => (
                      <div key={s.uid} className="flex items-center gap-3 rounded-xl bg-danger/5 border border-danger/15 px-3 py-2">
                        <span className="text-xs text-text-muted font-mono w-6">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text text-sm truncate">{locale === 'ar' ? s.nameAR : s.nameEN}</p>
                          <p className="text-xs text-text-muted font-mono">{s.id}</p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-danger bg-danger/10 rounded-full px-2 py-0.5">✗</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 bg-surface-2 px-6 py-4 border-t border-border flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="rounded-xl bg-surface px-5 py-2.5 text-sm font-semibold text-text hover:bg-surface-2/60 transition-colors border border-border"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-bg shadow-[0_0_15px_var(--color-accent-glow)] transition-transform hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Save as PDF
              </button>
            </div>
          </motion.div>

          {/* ─── PRINT TEMPLATE (hidden normally, shown when printing) ─── */}
          <div
            ref={reportRef}
            id="hodor-print-report"
            data-lecture-name={lectureName}
            data-attending={attending}
            data-absent={absent}
            data-percentage={percentage}
            data-duration={durationStr}
            data-start={startTime.toLocaleString(locale)}
            data-end={endTime.toLocaleString(locale)}
            data-attending-names={attendingStudents.map(s => `${locale === 'ar' ? s.nameAR : s.nameEN}|${s.id}`).join(',')}
            data-absent-names={absentStudents.map(s => `${locale === 'ar' ? s.nameAR : s.nameEN}|${s.id}`).join(',')}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
