import React, { useEffect, useState } from 'react';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  totalXp: number;
  completedTasks: number;
  inProgressTasks: number;
  avgTime: number;
}

interface StaffManagementProps {
  onOpenStaffModal?: () => void;
}

export default function StaffManagement({ onOpenStaffModal }: StaffManagementProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/staff');
        if (!response.ok) throw new Error('Failed to fetch staff');
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">スタッフ管理</h2>
          <p className="text-sm text-gray-500 mt-1">アルバイトスタッフの成績と統計を表示</p>
        </div>
        {onOpenStaffModal && (
          <button
            onClick={onOpenStaffModal}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            新規追加
          </button>
        )}
      </div>

      {/* スタッフ一覧 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">スタッフ名</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">合計XP</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">完了タスク</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">進行中</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">平均時間</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">レベル</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staff.map(member => {
              const level = Math.floor(member.totalXp / 100) + 1;
              const progressPercent = (member.totalXp % 100) / 100;

              return (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {member.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-purple-600">{member.totalXp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                      {member.completedTasks}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      {member.inProgressTasks}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600">{member.avgTime} 分</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-bold">
                        Lv. {level}
                      </div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all"
                          style={{ width: `${progressPercent * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 統計サマリー */}
      {staff.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">総スタッフ数</div>
            <div className="text-3xl font-bold text-gray-900">{staff.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">平均XP</div>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(staff.reduce((sum, s) => sum + s.totalXp, 0) / staff.length)}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">合計完了タスク</div>
            <div className="text-3xl font-bold text-green-600">
              {staff.reduce((sum, s) => sum + s.completedTasks, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">進行中タスク</div>
            <div className="text-3xl font-bold text-blue-600">
              {staff.reduce((sum, s) => sum + s.inProgressTasks, 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
