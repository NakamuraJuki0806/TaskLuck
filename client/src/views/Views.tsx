import type { ReactNode } from 'react';
import { Priority, TaskStatus, User, Shift, Task, GachaLog, Notification } from '../models';

type AuthViewProps = {
  selectedRole: 'staff' | 'part';
  onSelectRole: (role: 'staff' | 'part') => void;
  loginUserId: number | '';
  setLoginUserId: (value: number | '') => void;
  userOptions: User[];
  handleLogin: () => void;
};

export function AuthView({ selectedRole, onSelectRole, loginUserId, setLoginUserId, userOptions, handleLogin }: AuthViewProps) {
  return (
    <div id="login-screen">
      <div className="lbox">
        <div className="llogo">
          <div className="llogo-ic">🍲</div>
          <div className="llogo-nm">TaskLuck</div>
        </div>
        <h2>ユーザーIDを入力してログイン</h2>
        <div className="fg">
          <label>ユーザーID</label>
          <input
            type="text"
            value={loginUserId}
            onChange={(event) => setLoginUserId(event.target.value ? Number(event.target.value) : '')}
            placeholder="ユーザーIDを入力 (例: 1)"
          />
        </div>
        <div className="fg">
          <label>パスワード</label>
          <input type="password" value="demo" readOnly placeholder="demo" />
        </div>
        <button className="btn-login" type="button" onClick={handleLogin}>ログイン</button>
        <p className="lhint">デモ用：パスワードは「demo」で固定</p>
      </div>
    </div>
  );
}

type DashboardViewProps = {
  isActive: boolean;
  isMgr: boolean;
  currentUser: User;
  dsObj: { todShifts: Shift[]; myTasks: Task[]; approvalCountParam: number };
  tasks: Task[];
  todayShifts: Array<{ shift: Shift; user: User | { name: string; ini: string }; isMine: boolean }> | null;
  dashTasks: Task[] | null;
  statusBadge: (s: TaskStatus) => ReactNode;
  priorityBadge: (p: Priority) => ReactNode;
};

export function DashboardView({ isActive, isMgr, currentUser, dsObj, tasks, todayShifts, dashTasks, statusBadge, priorityBadge }: DashboardViewProps) {
  return (
    <div className={`page ${isActive ? 'show' : ''}`} id="pg-dashboard">
      <div className="ph">
        <div><div className="pt">ダッシュボード</div><div className="ps" id="dd">{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</div></div>
      </div>
      <div className="stats" id="ds">{
        isMgr ? (
          <>
            <div className="sc"><div className="sl">本日出勤</div><div className="sv">{dsObj.todShifts.length}</div></div>
            <div className="sc"><div className="sl">総タスク</div><div className="sv">{tasks.length}</div></div>
            <div className="sc"><div className="sl">承認待ち</div><div className="sv">{dsObj.approvalCountParam}</div></div>
            <div className="sc"><div className="sl">未割当</div><div className="sv">{tasks.filter((task) => !task.to).length}</div></div>
          </>
        ) : (
          <>
            <div className="sc"><div className="sl">レベル</div><div className="sv">Lv.{Math.floor((currentUser?.xp ?? 0) / 100) + 1}</div></div>
            <div className="sc"><div className="sl">合計 XP</div><div className="sv">{currentUser?.xp ?? 0}</div></div>
            <div className="sc"><div className="sl">進行中タスク</div><div className="sv">{dsObj.myTasks.length}</div></div>
            <div className="sc">
              <div className="sl">次LVまで</div>
              <div className="sv" style={{ fontSize: '16px' }}>{(currentUser?.xp ?? 0) % 100}<span style={{ fontSize: '11px', color: '#aaa' }}>/100</span></div>
              <div className="xp-wrap"><div className="xp-bar" style={{ width: `${(currentUser?.xp ?? 0) % 100}%` }} /></div>
            </div>
          </>
        )
      }</div>
      <div className="dash-grid">
        <div className="card"><div className="sec-lbl">今日のシフト</div><div id="dt-shifts">{
          !todayShifts || todayShifts.length === 0 ? (
            <div style={{ color: '#aaa', fontSize: '12px', padding: '8px 0' }}>本日のシフトはありません</div>
          ) : todayShifts.map(({ shift, user, isMine }) => (
            <div className="ti" key={shift.id}>
              <div className="sb-avatar" style={{ width: '26px', height: '26px', fontSize: '10px', flexShrink: 0 }}>{user.ini ?? '?'}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: isMine ? 500 : 400 }}>
                  {user.name}{isMine ? ' ' : ''}{isMine ? <span className="b b-gray" style={{ fontSize: '10px' }}>自分</span> : null}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>{shift.s}–{shift.e}</div>
              </div>
            </div>
          ))
        }</div></div>
        <div className="card"><div className="sec-lbl">タスク状況</div><div id="dt-tasks">{
          !dashTasks || dashTasks.length === 0 ? (
            <div style={{ color: '#aaa', fontSize: '12px', padding: '8px 0' }}>タスクはありません</div>
          ) : dashTasks.map((task) => (
            <div className="ti" key={task.id}>
              <div className={`pdot ${task.pri === 'high' ? 'p-h' : task.pri === 'mid' ? 'p-m' : 'p-l'}`} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{task.name}</div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '3px' }}>{statusBadge(task.st)}<span style={{ fontSize: '11px', color: '#888' }}>+{task.xp} XP</span></div>
              </div>
            </div>
          ))
        }</div></div>
      </div>
    </div>
  );
}

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
};

export function ShiftView({ isActive, isMgr, onOpenShiftRequest, onOpenShiftCreate, cal, currentMonthLabel, setCm, shiftRows, users, toast, setShifts, csUid, setCsUid, csDate, setCsDate, csStart, setCsStart, csEnd, setCsEnd, onShiftRequestSubmit, onShiftCreateSubmit }: ShiftViewProps) {
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
              {cal.dayNames.map((dn) => <div className="cal-dn" key={dn}>{dn}</div>)}
              {cal.cells.map((cell, idx) => {
                if (cell.type === 'prev' || cell.type === 'next') return <div className="cal-cell other" key={idx}><div className="cal-n">{cell.dateNumber}</div></div>;
                return (
                  <div className={`cal-cell${cell.isToday ? ' today' : ''}`} key={cell.dateKey}>
                    <div className="cal-n">{cell.day}</div>
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

type TaskViewProps = {
  isActive: boolean;
  isStf: boolean;
  tFilter: TaskStatus | 'all';
  setTFilter: (filter: TaskStatus | 'all') => void;
  tasksForView: Task[];
  users: User[];
  priorityBadge: (p: Priority) => ReactNode;
  statusBadge: (s: TaskStatus) => ReactNode;
  renderTaskActions: (task: Task) => ReactNode;
  onOpenTaskModal: () => void;
};

export function TaskView({ isActive, isStf, tFilter, setTFilter, tasksForView, users, priorityBadge, statusBadge, renderTaskActions, onOpenTaskModal }: TaskViewProps) {
  return (
    <div className={`page ${isActive ? 'show' : ''}`} id="pg-task">
      <div className="ph">
        <div><div className="pt">タスク管理</div></div>
        {isStf ? <button className="btn btn-dark" id="btn-ct" type="button" onClick={onOpenTaskModal}>+ タスク追加</button> : null}
      </div>
      <div className="card">
        <div className="tabs">
          {(['all','pending','in_progress','review','done'] as const).map((filter) => (
            <button key={filter} className={`tab ${tFilter === filter ? 'active' : ''}`} type="button" onClick={() => setTFilter(filter)}>
              {filter === 'all' ? 'すべて' : filter === 'pending' ? '未着手' : filter === 'in_progress' ? '進行中' : filter === 'review' ? '承認待ち' : '完了'}
            </button>
          ))}
        </div>
        <table className="tbl" id="ttbl">
          <thead>
            <tr>
              <th>タスク名</th>
              <th>優先度</th>
              <th>担当</th>
              <th>XP</th>
              <th>状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {tasksForView.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '2rem', fontSize: '13px' }}>タスクはありません</td></tr>
            ) : tasksForView.map((task) => {
              const assignee = task.to ? users.find((user) => user.id === task.to) : null;
              return (
                <tr key={task.id}>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{task.name}</div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>{task.desc}</div>
                  </td>
                  <td>{priorityBadge(task.pri)}</td>
                  <td>{assignee ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div className="sb-avatar" style={{ width: '22px', height: '22px', fontSize: '9px', flexShrink: 0 }}>{assignee.ini}</div>
                      <span>{assignee.name}</span>
                    </div>
                  ) : <span style={{ color: '#aaa' }}>未割当</span>}</td>
                  <td style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>+{task.xp}</td>
                  <td>{statusBadge(task.st)}</td>
                  <td>{renderTaskActions(task)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type GachaViewProps = {
  isActive: boolean;
  gachaLabel: string;
  gLog: GachaLog[];
  handleGacha: () => void;
  handleCompleteGachaTask: () => void;
  gachaTaskVal: Task | undefined;
  gachaLock: boolean;
  gachaEnabled?: boolean;
};

export function GachaView({ isActive, gachaLabel, gLog, handleGacha, handleCompleteGachaTask, gachaTaskVal, gachaLock, gachaEnabled = true }: GachaViewProps) {
  // pull totals derived from gLog
  const pullTotal = gLog.length;
  const pullLast = gLog.length ? gLog[gLog.length - 1].rarity ?? gLog[gLog.length - 1].name : '—';

  return (
    <div className={`page ${isActive ? 'show' : ''}`} id="pg-gacha">
      <div className="ph"><div><div className="pt">闇鍋ガチャ</div><div className="ps">ランダムにタスクが割り当てられます</div></div></div>
      <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* ガチャ待機画面 */}
        <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
          {gachaTaskVal ? (
            // 対応中のタスク表示
            <div>
              <div className="mb-6">
                <div className="inline-block bg-purple-50 border border-purple-200 rounded-full px-4 py-2 mb-4">
                  <span className="text-sm text-purple-600">
                    対応中
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">{gachaTaskVal.name}</h2>
              <p className="text-gray-600 text-sm mb-6">{gachaTaskVal.desc}</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-xs text-gray-500 mb-1">予定XP</div>
                <div className="text-3xl font-bold text-purple-600">+{gachaTaskVal.xp || 0} XP</div>
              </div>
              <button
                onClick={handleCompleteGachaTask}
                className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={gachaLock}
              >
                タスク完了
              </button>
            </div>
          ) : (
            // ガチャ待機画面
            <div>
              <div className="text-6xl mb-4">🍲</div>
              <h2 className="text-2xl font-bold mb-2">闇鍋ガチャ</h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                タスクから何が飛び出すかは運次第...
                <br />
                ガチャを回してタスクを引き当てよう！
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-full px-4 py-2 inline-flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-600">
                  総回数: <span className="font-bold text-purple-600">{pullTotal}</span>
                </span>
              </div>
              <div className="mb-6">
                <div className="text-xs text-gray-500 mb-2">最後の結果</div>
                <div className="text-lg font-bold text-purple-600">{pullLast}</div>
              </div>
              <button
                onClick={handleGacha}
                disabled={gachaLock || !gachaEnabled}
                className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gachaLock ? '処理中...' : 'ガチャを回す'}
              </button>
            </div>
          )}
        </div>
        {/* ガチャ履歴 */}
        {gLog.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">ガチャ履歴</h3>
              <p className="text-xs text-gray-500 mt-1">{gLog.length}件</p>
            </div>
            <div className="divide-y divide-gray-200">
              {gLog.slice().reverse().slice(0, 8).map((entry, index) => (
                <div key={`${entry.name}-${index}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                  <div className="w-1 h-12 bg-purple-100 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                    <p className="text-xs text-gray-500">{entry.rarity ?? 'NORMAL'} · {entry.time ?? ''}</p>
                  </div>
                  <div className="text-lg font-bold text-purple-600">+{entry.xp} XP</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type ApprovalViewProps = {
  isActive: boolean;
  approvalTasks: Task[];
  users: User[];
  priorityBadge: (p: Priority) => ReactNode;
  handleApproval: (id: number, approved: boolean) => void;
};

export function ApprovalView({ isActive, approvalTasks, users, priorityBadge, handleApproval }: ApprovalViewProps) {
  return (
    <div className={`page ${isActive ? 'show' : ''}`} id="pg-approval">
      <div className="ph"><div><div className="pt">完了承認</div><div className="ps">スタッフからの申請を確認して承認します</div></div></div>
      <div className="card">
        <table className="tbl" id="atbl">
          <thead>
            <tr>
              <th>タスク名</th>
              <th>担当</th>
              <th>優先度</th>
              <th>XP</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {approvalTasks.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '2rem', fontSize: '13px' }}>承認待ちのタスクはありません</td></tr>
            ) : approvalTasks.map((task) => {
              const assignee = users.find((user) => user.id === task.to) ?? { name: '?', ini: '?' };
              return (
                <tr key={task.id}>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{task.name}</div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>{task.desc}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div className="sb-avatar" style={{ width: '22px', height: '22px', fontSize: '9px' }}>{assignee.ini}</div>
                      {assignee.name}
                    </div>
                  </td>
                  <td>{priorityBadge(task.pri)}</td>
                  <td style={{ fontSize: '13px', fontWeight: 500, color: '#555' }}>+{task.xp}</td>
                  <td style={{ display: 'flex', gap: '5px', padding: '8px 12px' }}>
                    <button className="btn btn-sm" type="button" style={{ color: '#15803d', borderColor: '#bbf7d0' }} onClick={() => handleApproval(task.id, true)}>承認</button>
                    <button className="btn btn-sm btn-danger" type="button" onClick={() => handleApproval(task.id, false)}>却下</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type NotificationPanelProps = {
  open: boolean;
  notifications: Notification[];
  unreadCount: number;
  onClose: () => void;
  onRead: (id: number) => void;
  onClear: () => void;
};

export function NotificationPanel({ open, notifications, unreadCount, onClose, onRead, onClear }: NotificationPanelProps) {
  return (
    <div className={`notif-panel ${open ? 'open' : ''}`} id="notif-panel">
      <div className="notif-hdr">
        <div className="notif-title">通知</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: '#999' }}>{unreadCount} 未読</div>
          <button className="notif-clear" type="button" onClick={onClear}>すべて既読</button>
          <button className="btn btn-sm" type="button" onClick={onClose}>閉じる</button>
        </div>
      </div>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">通知はありません</div>
        ) : notifications.map((n) => (
          <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={() => onRead(n.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ minWidth: 0 }}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-sub">{n.sub}</div>
              </div>
              {!n.read ? <div className="notif-dot" /> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type StaffViewProps = {
  isActive: boolean;
  users: User[];
  staffStats: { total: number; partCount: number; staffCount: number };
  onOpenStaffModal: () => void;
};

export function StaffView({ isActive, users, staffStats, onOpenStaffModal }: StaffViewProps) {
  return (
    <div className={`page ${isActive ? 'show' : ''}`} id="pg-staff">
      <div className="ph">
        <div><div className="pt">スタッフ管理</div></div>
        <button className="btn btn-dark" type="button" onClick={onOpenStaffModal}>+ スタッフ追加</button>
      </div>
      <div className="stats" id="ss">
        <div className="sc"><div className="sl">総スタッフ</div><div className="sv">{staffStats.total}</div></div>
        <div className="sc"><div className="sl">社員</div><div className="sv">{staffStats.staffCount}</div></div>
        <div className="sc"><div className="sl">アルバイト</div><div className="sv">{staffStats.partCount}</div></div>
      </div>
      <div className="card">
        <table className="tbl" id="sstbl">
          <thead>
            <tr>
              <th>名前</th>
              <th>役割</th>
              <th>XP</th>
              <th>レベル</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const lv = Math.floor(user.xp / 100) + 1;
              const xn = user.xp % 100;
              const roleBadge = user.role === 'manager' ? <span className="b b-gray">店長</span> : user.role === 'staff' ? <span className="b b-blue">社員</span> : <span className="b b-gray">アルバイト</span>;
              return (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="sb-avatar">{user.ini}</div>
                      <span style={{ fontWeight: 500 }}>{user.name}</span>
                    </div>
                  </td>
                  <td>{roleBadge}</td>
                  <td style={{ fontSize: '13px' }}>{user.xp} XP</td>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>Lv.{lv}</div>
                    <div className="xp-wrap" style={{ width: '80px' }}><div className="xp-bar" style={{ width: `${xn}%` }} /></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
