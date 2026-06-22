import { type ReactNode } from 'react';
import { Priority, TaskStatus, User, Shift, Task } from '../models';

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
  approvalTasks: Task[];
  users: User[];
  handleApproval: (id: number, approved: boolean) => void;
};

export function DashboardView({ isActive, isMgr, currentUser, dsObj, tasks, todayShifts, dashTasks, statusBadge, priorityBadge, approvalTasks, users, handleApproval }: DashboardViewProps) {
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
      <div className="card">
        <div className="sec-lbl">承認待ち</div>
        <div className="card-body">
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
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '2rem', fontSize: '13px' }}>承認待ちタスクはありません</td></tr>
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
    </div>
  );
}
