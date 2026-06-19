import React, { useState } from 'react';
import { User, ShiftPattern } from '../models';

interface ShiftRequestScreenProps {
  isActive: boolean;
  currentUser: any;
  cal: { monthNames: string[]; dayNames: string[]; cells: any[] } | null;
  currentMonthLabel: string;
  setCm: (fn: (prev: number) => number) => void;
  users: User[];
  shiftPatterns: ShiftPattern[];
  setShiftPatterns: (fn: (prev: ShiftPattern[]) => ShiftPattern[]) => void;
  reqDate: string;
  setReqDate: (date: string) => void;
  reqOff: boolean;
  setReqOff: (off: boolean) => void;
  reqNote: string;
  setReqNote: (note: string) => void;
  onSubmit: (patternId: number) => void;
  onCancel: () => void;
}

export default function ShiftRequestScreen({
  isActive,
  currentUser,
  cal,
  currentMonthLabel,
  setCm,
  users,
  shiftPatterns,
  setShiftPatterns,
  reqDate,
  setReqDate,
  reqOff,
  setReqOff,
  reqNote,
  setReqNote,
  onSubmit,
  onCancel,
}: ShiftRequestScreenProps) {
  const [selectedPatternId, setSelectedPatternId] = useState<number | ''>('');
  const [showPatternForm, setShowPatternForm] = useState(false);
  const [newPattern, setNewPattern] = useState({
    title: '',
    workStart: '09:00',
    workEnd: '17:00',
    breakTime: 0,
    memo: '',
  });

  const handlePatternCreate = () => {
    if (!newPattern.title.trim()) {
      alert('パターン名を入力してください');
      return;
    }
    const maxId = shiftPatterns.length > 0 ? Math.max(...shiftPatterns.map((p) => p.id)) : 0;
    setShiftPatterns((prev) => [
      ...prev,
      {
        id: maxId + 1,
        title: newPattern.title.trim(),
        workStart: newPattern.workStart,
        workEnd: newPattern.workEnd,
        breakTime: parseInt(newPattern.breakTime.toString()) || 0,
        memo: newPattern.memo.trim(),
      },
    ]);
    setNewPattern({
      title: '',
      workStart: '09:00',
      workEnd: '17:00',
      breakTime: 0,
      memo: '',
    });
    setShowPatternForm(false);
  };
  return (
    <div className={`page ${isActive ? 'show' : ''}`} id="pg-shift-request">
      <div className="ph">
        <div>
          <div className="pt">シフト希望を提出</div>
          <div className="ps">出勤希望日時を選択して提出してください</div>
        </div>
      </div>

      {/* カレンダー */}
      <div className="card" style={{ marginBottom: '12px', position: 'relative' }}>
        {cal ? (
          <>
            <div className="cal-nav">
              <button className="btn btn-sm" type="button" onClick={() => setCm((prev) => prev - 1 < 0 ? 11 : prev - 1)}>
                ‹‹
              </button>
              <span className="cal-month">{currentMonthLabel}</span>
              <button className="btn btn-sm" type="button" onClick={() => setCm((prev) => prev + 1 > 11 ? 0 : prev + 1)}>
                ››
              </button>
            </div>
            <div className="cal-grid">
              {cal.dayNames.map((dn) => (
                <div className="cal-dn" key={dn}>
                  {dn}
                </div>
              ))}
              {cal.cells.map((cell, idx) => {
                if (cell.type === 'prev' || cell.type === 'next')
                  return (
                    <div className="cal-cell other" key={idx}>
                      <div className="cal-n">{cell.dateNumber}</div>
                    </div>
                  );
                return (
                  <div
                    className={`cal-cell${cell.isToday ? ' today' : ''}${reqDate === cell.dateKey ? ' selected' : ''}`}
                    key={cell.dateKey}
                    onClick={() => setReqDate(cell.dateKey)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="cal-n">{cell.day}</div>
                  </div>
                );
              })}
            </div>

            {/* パターン登録ボタン */}
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setShowPatternForm(!showPatternForm)}
              style={{
                marginTop: '12px',
                width: '100%',
                fontSize: '12px',
              }}
            >
              {showPatternForm ? '閉じる' : '+ 新規パターン'}
            </button>

            {/* パターン登録フォーム */}
            {showPatternForm && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#f9f9f9',
                  borderRadius: '7px',
                  border: '1px solid #e5e5e5',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '8px' }}>新規パターン</div>
                <div className="mfg">
                  <label style={{ fontSize: '12px' }}>パターン名</label>
                  <input
                    type="text"
                    value={newPattern.title}
                    onChange={(e) => setNewPattern({ ...newPattern, title: e.target.value })}
                    placeholder="例：パターンA"
                    style={{ fontSize: '12px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="mfg">
                    <label style={{ fontSize: '12px' }}>開始時間</label>
                    <input
                      type="time"
                      value={newPattern.workStart}
                      onChange={(e) => setNewPattern({ ...newPattern, workStart: e.target.value })}
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                  <div className="mfg">
                    <label style={{ fontSize: '12px' }}>終了時間</label>
                    <input
                      type="time"
                      value={newPattern.workEnd}
                      onChange={(e) => setNewPattern({ ...newPattern, workEnd: e.target.value })}
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                </div>
                <div className="mfg">
                  <label style={{ fontSize: '12px' }}>休憩時間（分）</label>
                  <input
                    type="number"
                    value={newPattern.breakTime}
                    onChange={(e) => setNewPattern({ ...newPattern, breakTime: Number(e.target.value) })}
                    min="0"
                    step="15"
                    style={{ fontSize: '12px' }}
                  />
                </div>
                <div className="mfg">
                  <label style={{ fontSize: '12px' }}>メモ</label>
                  <input
                    type="text"
                    value={newPattern.memo}
                    onChange={(e) => setNewPattern({ ...newPattern, memo: e.target.value })}
                    placeholder="例：平日用"
                    style={{ fontSize: '12px' }}
                  />
                </div>
                <div className="mf" style={{ gap: '6px', marginTop: '8px' }}>
                  <button className="btn btn-sm" type="button" onClick={() => setShowPatternForm(false)}>
                    キャンセル
                  </button>
                  <button className="btn btn-sm btn-dark" type="button" onClick={handlePatternCreate}>
                    登録
                  </button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* フォーム */}
      <div className="card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!reqDate) {
              alert('日付を選択してください');
              return;
            }
            if (!selectedPatternId && !reqOff) {
              alert('シフトパターンを選択してください');
              return;
            }
            onSubmit(selectedPatternId as number);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* 選択日付表示 */}
          {reqDate && (
            <div
              style={{
                background: '#f0f9ff',
                border: '1px solid #bfdbfe',
                borderRadius: '7px',
                padding: '10px 12px',
                fontSize: '13px',
                color: '#1e40af',
              }}
            >
              ✓ 選択日付: <strong>{new Date(reqDate + 'T00:00:00').toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</strong>
            </div>
          )}

          {/* 出勤不可チェック */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              background: '#fafafa',
              borderRadius: '7px',
              cursor: 'pointer',
            }}
            onClick={() => setReqOff(!reqOff)}
          >
            <input
              type="checkbox"
              checked={reqOff}
              onChange={(e) => setReqOff(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label style={{ cursor: 'pointer', margin: 0, flex: 1 }}>
              この日は出勤不可
            </label>
          </div>

          {/* シフトパターン選択 */}
          {!reqOff && (
            <div className="mfg">
              <label>シフトパターン</label>
              <select
                value={selectedPatternId}
                onChange={(e) => setSelectedPatternId(e.target.value ? Number(e.target.value) : '')}
                required={!reqOff}
              >
                <option value="">-- パターンを選択 --</option>
                {shiftPatterns.map((pattern) => (
                  <option key={pattern.id} value={pattern.id}>
                    {pattern.title} ({pattern.workStart}～{pattern.workEnd}, 休憩{pattern.breakTime}分) {pattern.memo && `- ${pattern.memo}`}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                あらかじめ登録されたシフトパターンから選択します
              </div>
            </div>
          )}

          {/* 備考 */}
          <div className="mfg">
            <label>備考（任意）</label>
            <textarea
              value={reqNote}
              onChange={(e) => setReqNote(e.target.value)}
              placeholder="例：この日だけ16時までなら可能 など"
              style={{
                borderRadius: '7px',
                padding: '8px 11px',
                border: '1px solid #e5e5e5',
                fontFamily: 'inherit',
                fontSize: '13px',
                minHeight: '60px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* 確認エリア */}
          <div
            style={{
              background: '#f5f5f7',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '12px',
              color: '#666',
            }}
          >
            <div style={{ fontWeight: 500, marginBottom: '6px' }}>確認事項</div>
            <ul
              style={{
                marginLeft: '18px',
                paddingLeft: 0,
                lineHeight: '1.6',
              }}
            >
              <li>提出されたシフト希望は管理者による確認が必要です</li>
              <li>最終的な勤務シフトは管理者より別途通知されます</li>
              {reqOff && (
                <li style={{ color: '#b91c1c', fontWeight: 500 }}>
                  ⚠️ この日は出勤不可として登録されます
                </li>
              )}
            </ul>
          </div>

          {/* ボタン */}
          <div className="mf" style={{ marginTop: '16px' }}>
            <button
              className="btn"
              type="button"
              onClick={onCancel}
              style={{ marginRight: 'auto' }}
            >
              キャンセル
            </button>
            <button className="btn btn-dark" type="submit" disabled={!reqDate}>
              シフト希望を提出
            </button>
          </div>
        </form>
      </div>

      {/* 情報カード */}
      <div
        className="card"
        style={{
          marginTop: '24px',
          background: '#faf5ff',
          border: '1px solid #f3e8ff',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '8px', color: '#7e22ce' }}>
          ℹ️ シフト希望について
        </div>
        <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 6px 0' }}>
            • シフト希望は毎月末日までに提出してください
          </p>
          <p style={{ margin: '0 0 6px 0' }}>
            • 希望が必ず採用されるわけではありません
          </p>
          <p style={{ margin: '0 0 6px 0' }}>
            • 希望内容に関する質問は店長までお問い合わせください
          </p>
          <p style={{ margin: 0 }}>
            • 提出後の変更は通知にて可能です
          </p>
        </div>
      </div>
    </div>
  );
}
