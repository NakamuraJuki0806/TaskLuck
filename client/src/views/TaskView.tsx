import { type ReactNode } from 'react';
import { Priority, TaskStatus, Task, User } from '../models';

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
