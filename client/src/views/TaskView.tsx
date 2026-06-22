import { type ReactNode, useMemo, useState } from 'react';
import { Priority, TaskStatus, Task, User } from '../models';

type TaskViewProps = {
  isActive: boolean;
  isStf: boolean;
  tFilter: TaskStatus | 'all';
  setTFilter: (filter: TaskStatus | 'all') => void;
  tasksForView: Task[];
  allTasks: Task[];
  users: User[];
  priorityBadge: (p: Priority) => ReactNode;
  statusBadge: (s: TaskStatus) => ReactNode;
  renderTaskActions: (task: Task) => ReactNode;
  onOpenTaskModal: () => void;
};

export function TaskView({ isActive, isStf, tFilter, setTFilter, tasksForView, allTasks, users, priorityBadge, statusBadge, renderTaskActions, onOpenTaskModal }: TaskViewProps) {
  const [poolFilter, setPoolFilter] = useState<'all' | 'in' | 'out'>('all');
  const [selectedPrios, setSelectedPrios] = useState<Priority[] | []>([]);
  const [assigneeFilter, setAssigneeFilter] = useState<number | 'all' | 'unassigned'>('all');
  const [xpMin, setXpMin] = useState<number | ''>('');
  const [xpMax, setXpMax] = useState<number | ''>('');
  const [sortKey, setSortKey] = useState<'name' | 'pri' | 'to' | 'xp' | 'st'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const activeFilterCount = [
    poolFilter !== 'all',
    selectedPrios.length > 0,
    assigneeFilter !== 'all',
    xpMin !== '',
    xpMax !== '',
  ].filter(Boolean).length;

  const filteredTasks = useMemo(() => {
    let list = tasksForView.slice();
    if (poolFilter !== 'all') list = list.filter((t) => poolFilter === 'in' ? !!t.inPool : !t.inPool);
    if (selectedPrios.length) list = list.filter((t) => selectedPrios.includes(t.pri));
    if (assigneeFilter !== 'all') {
      if (assigneeFilter === 'unassigned') {
        list = list.filter((t) => !t.to);
      } else {
        list = list.filter((t) => t.to === assigneeFilter);
      }
    }
    if (xpMin !== '') list = list.filter((t) => t.xp >= Number(xpMin));
    if (xpMax !== '') list = list.filter((t) => t.xp <= Number(xpMax));

    list.sort((a, b) => {
      let res = 0;
      if (sortKey === 'name') res = a.name.localeCompare(b.name);
      if (sortKey === 'pri') res = a.pri.localeCompare(b.pri);
      if (sortKey === 'to') res = (a.to ?? 0) - (b.to ?? 0);
      if (sortKey === 'xp') res = a.xp - b.xp;
      if (sortKey === 'st') res = a.st.localeCompare(b.st);
      return sortOrder === 'asc' ? res : -res;
    });

    return list;
  }, [tasksForView, poolFilter, selectedPrios, assigneeFilter, xpMin, xpMax, sortKey, sortOrder]);
  return (
    <div className={`page ${isActive ? 'show' : ''}`} id="pg-task">
      <div className="ph">
        <div><div className="pt">タスク管理</div></div>
        {isStf ? <button className="btn btn-dark" id="btn-ct" type="button" onClick={onOpenTaskModal}>+ タスク追加</button> : null}
      </div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div className="tabs">
          {(['all','pending','in_progress','review','done'] as const).map((filter) => (
            <button key={filter} className={`tab ${tFilter === filter ? 'active' : ''}`} type="button" onClick={() => setTFilter(filter)}>
              {filter === 'all' ? 'すべて' : filter === 'pending' ? '未着手' : filter === 'in_progress' ? '進行中' : filter === 'review' ? '承認待ち' : '完了'}
            </button>
          ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>{allTasks.filter((t) => t.inPool).length}/{allTasks.length} プール</div>
            <button className="btn btn-sm" type="button" onClick={() => setShowFilterPopup(true)}>
              絞り込み条件{activeFilterCount ? ` (${activeFilterCount})` : ''}
            </button>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as any)}>
              <option value="name">名前で並び替え</option>
              <option value="pri">優先度</option>
              <option value="to">担当</option>
              <option value="xp">XP</option>
              <option value="st">状態</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}>
              <option value="asc">昇順</option>
              <option value="desc">降順</option>
            </select>
          </div>
          {showFilterPopup ? (
            <div className="overlay open" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }} onClick={(event) => { if (event.target === event.currentTarget) setShowFilterPopup(false); }}>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: 'min(720px,100%)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 15px 45px rgba(0,0,0,0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0 }}>絞り込み条件</h3>
                  <button className="btn btn-sm" type="button" onClick={() => setShowFilterPopup(false)}>閉じる</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>プール</div>
                    <select value={poolFilter} onChange={(e) => setPoolFilter(e.target.value as any)} style={{ width: '100%' }}>
                      <option value="all">全て</option>
                      <option value="in">プール内</option>
                      <option value="out">プール外</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>担当</div>
                    <select value={assigneeFilter} onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'all' || value === 'unassigned') {
                        setAssigneeFilter(value as 'all' | 'unassigned');
                      } else {
                        setAssigneeFilter(Number(value));
                      }
                    }} style={{ width: '100%' }}>
                      <option value="all">全て</option>
                      <option value="unassigned">未割当</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>優先度</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" checked={selectedPrios.includes('high')} onChange={(e) => setSelectedPrios((prev) => e.target.checked ? [...prev, 'high'] : prev.filter((p) => p !== 'high'))} /> 高</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" checked={selectedPrios.includes('mid')} onChange={(e) => setSelectedPrios((prev) => e.target.checked ? [...prev, 'mid'] : prev.filter((p) => p !== 'mid'))} /> 中</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" checked={selectedPrios.includes('low')} onChange={(e) => setSelectedPrios((prev) => e.target.checked ? [...prev, 'low'] : prev.filter((p) => p !== 'low'))} /> 低</label>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>XP</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="number" value={xpMin} min={0} onChange={(e) => setXpMin(e.target.value === '' ? '' : Number(e.target.value))} placeholder="最小" style={{ width: '100%' }} />
                      <input type="number" value={xpMax} min={0} onChange={(e) => setXpMax(e.target.value === '' ? '' : Number(e.target.value))} placeholder="最大" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>並び替え</div>
                    <select value={sortKey} onChange={(e) => setSortKey(e.target.value as any)} style={{ width: '100%', marginBottom: '10px' }}>
                      <option value="name">名前</option>
                      <option value="pri">優先度</option>
                      <option value="to">担当</option>
                      <option value="xp">XP</option>
                      <option value="st">状態</option>
                    </select>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} style={{ width: '100%' }}>
                      <option value="asc">昇順</option>
                      <option value="desc">降順</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '18px' }}>
                  <button className="btn" type="button" onClick={() => {
                    setPoolFilter('all');
                    setSelectedPrios([]);
                    setAssigneeFilter('all');
                    setXpMin('');
                    setXpMax('');
                    setSortKey('name');
                    setSortOrder('asc');
                  }}>クリア</button>
                  <button className="btn btn-dark" type="button" onClick={() => setShowFilterPopup(false)}>適用</button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '10px 0', alignItems: 'center' }}>
            <div style={{ color: '#666', fontSize: '13px' }}>
              {activeFilterCount ? `絞り込み条件 ${activeFilterCount} 件設定中` : '絞り込み条件はボタンから設定できます'}
            </div>
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
            {filteredTasks.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '2rem', fontSize: '13px' }}>タスクはありません</td></tr>
            ) : filteredTasks.map((task) => {
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
