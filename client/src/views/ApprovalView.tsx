import { type ReactNode } from 'react';
import { Priority, Task, User } from '../models';

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
