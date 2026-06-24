import { type ReactNode } from 'react';
import { Shift, User, BusinessInfo } from '../models';

type ShiftRow = { shift: Shift; user: User | { name: string; ini?: string }; badge: { label: string; cls: string } };

type ShiftViewProps = {
  isActive: boolean;
  isMgr: boolean;
  onOpenShiftRequest: () => void;
  onOpenShiftCreate: () => void;
  cal: { monthNames: string[]; dayNames: string[]; cells: any[] } | null;
  currentMonthLabel: string;
  setCm: (fn: (prev: number) => number) => void;
  shiftRows: ShiftRow[];
  users: User[];
  toast: (message: string) => void;
  setShifts: (fn: (prev: Shift[]) => Shift[]) => void;
  csUid: number;
  setCsUid: (value: number) => void;
  csDate: string;
  setCsDate: (value: string) => void;
  csStart: string;
  setCsStart: (value: string) => void;
  csEnd: string;
  setCsEnd: (value: string) => void;
  onShiftRequestSubmit: () => void;
  onShiftCreateSubmit: () => void;
  businessInfo: BusinessInfo;
};

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export function ShiftView({ isActive, isMgr, onOpenShiftRequest, onOpenShiftCreate, cal, currentMonthLabel, setCm, shiftRows, users, toast, setShifts, csUid, setCsUid, csDate, setCsDate, csStart, setCsStart, csEnd, setCsEnd, onShiftRequestSubmit, onShiftCreateSubmit, businessInfo }: ShiftViewProps) {
  return (
    <div className={`page ${isActive ? 'show' : ''}`} id="pg-shift">
      <div className="ph">
        <div><div className="pt">シフト管理</div></div>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          <button className="btn" type="button" onClick={onOpenShiftRequest}>+ 希望を提出</button>
          {isMgr ? <button className="btn btn-dark" id="btn-cs" type="button" onClick={onOpenShiftCreate}>{'+ シフト作成'}</button> : null}
        </div>
      </div>
      <div className="card" style={{ marginBottom: '12px' }}>
        {cal ? (
          <>
            <div className="cal-nav">
              <button className="btn btn-sm" type="button" onClick={() => setCm((prev) => prev - 1 < 0 ? 11 : prev - 1)}>‹‹</button>
              <span className="cal-month">{currentMonthLabel}</span>
              <button className="btn btn-sm" type="button" onClick={() => setCm((prev) => prev + 1 > 11 ? 0 : prev + 1)}>››</button>
            </div>
            <div className="cal-grid">
              {cal.dayNames.map((dn, i) => (
                <div
                  className="cal-dn"
                  key={dn}
                  style={{ color: i === 0 ? '#e0506a' : i === 6 ? '#4b9be0' : undefined }}
                >
                  {dn}
                </div>
              ))}
              {cal.cells.map((cell, idx) => {
                if (cell.type === 'prev' || cell.type === 'next') return <div className="cal-cell other" key={idx}><div className="cal-n">{cell.dateNumber}</div></div>;
                const dow = cell.dateKey ? new Date(cell.dateKey).getDay() : -1;
                const isClosed = dow >= 0 && businessInfo.hours[DAY_KEYS[dow]]?.closed;
                return (
                  <div className={`cal-cell${cell.isToday ? ' today' : ''}${isClosed ? ' closed' : ''}`} key={cell.dateKey}>
                    <div
                      className="cal-n"
                      style={{ color: dow === 0 ? '#e0506a' : dow === 6 ? '#4b9be0' : undefined }}
                    >
                      {cell.day}
                    </div>
                    {isClosed && (
                      <div style={{ fontSize: '10px', color: '#2f9e57', fontWeight: 600, textAlign: 'center', marginTop: '2px' }}>
                        定休日
                      </div>
                    )}
                    {cell.myShift ? (
                      <div className="cal-ev cal-ev-me">{cell.myShift.s.slice(0, 5)}-{cell.myShift.e.slice(0, 5)}</div>
                    ) : cell.dayShifts.slice(0, 2).map((shift: Shift) => {
                      const u = users.find((it) => it.id === shift.uid) ?? { ini: '?' };
                      return <div className="cal-ev cal-ev-other" key={`s-${shift.id}`}>{u.ini} {shift.s.slice(0, 5)}</div>;
                    })}
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
      <div className="card">
        <div className="sec-lbl">シフト一覧</div>
        <table className="tbl" id="stbl">
          <thead>
            <tr>
              <th>日付</th>
              <th>スタッフ</th>
              <th>時間</th>
              <th>状態</th>
              {isMgr ? <th>操作</th> : null}
            </tr>
          </thead>
          <tbody>
            {shiftRows.map(({ shift, user, badge }) => (
              <tr key={shift.id}>
                <td>{shift.date}</td>
                <td>{isMgr ? user.name : '自分'}</td>
                <td style={{ fontVariantNumeric: 'tabular-nums' }}>{shift.s}–{shift.e}</td>
                <td><span className={badge.cls}>{badge.label}</span></td>
                {isMgr ? (
                  <td style={{ display: 'flex', gap: '5px', padding: '8px 12px' }}>
                    {shift.st === 'request' ? (
                      <button className="btn btn-sm" type="button" style={{ color: '#15803d', borderColor: '#bbf7d0' }} onClick={() => {
                        setShifts((prev) => prev.map((item) => item.id === shift.id ? { ...item, st: 'confirmed' } : item));
                        toast('シフトを承認しました');
                      }}>
                        承認
                      </button>
                    ) : null}
                    <button className="btn btn-sm btn-danger" type="button" onClick={() => {
                      setShifts((prev) => prev.filter((item) => item.id !== shift.id));
                      toast('削除しました');
                    }}>
                      削除
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
