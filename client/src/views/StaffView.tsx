import { User } from '../models';

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
