import React, { useEffect, useState } from 'react';

interface ApprovalItem {
  id: number;
  taskId: number;
  taskName: string;
  userId: number;
  userName?: string;
  xp: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface ApprovalPageProps {
  // Props can be added as needed
}

export default function ApprovalPage({}: ApprovalPageProps) {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/approval');
        if (!response.ok) throw new Error('Failed to fetch approvals');
        const data = await response.json();
        setApprovals(data);
      } catch (error) {
        console.error('Error fetching approvals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/approval/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) throw new Error('Failed to approve');
      const updated = await response.json();
      setApprovals(approvals.map(a => (a.id === id ? { ...a, status: 'approved' } : a)));
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/approval/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!response.ok) throw new Error('Failed to reject');
      setApprovals(approvals.map(a => (a.id === id ? { ...a, status: 'rejected' } : a)));
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const filteredApprovals = filter === 'all' 
    ? approvals 
    : approvals.filter(a => a.status === filter);

  const pendingCount = approvals.filter(a => a.status === 'pending').length;

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">完了承認</h2>
        <p className="text-sm text-gray-500 mt-1">スタッフからのタスク完了報告を確認・承認します</p>
      </div>

      {/* ステータスバッジ */}
      {pendingCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
            {pendingCount}
          </div>
          <div>
            <div className="font-semibold text-blue-900">承認待ちがあります</div>
            <div className="text-sm text-blue-700">現在 {pendingCount} 件の完了報告が待機中です</div>
          </div>
        </div>
      )}

      {/* フィルタータブ */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              filter === tab
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'all' && '全て'}
            {tab === 'pending' && `承認待ち (${approvals.filter(a => a.status === 'pending').length})`}
            {tab === 'approved' && `承認済み (${approvals.filter(a => a.status === 'approved').length})`}
            {tab === 'rejected' && `却下 (${approvals.filter(a => a.status === 'rejected').length})`}
          </button>
        ))}
      </div>

      {/* 承認待ちリスト */}
      <div className="space-y-3">
        {filteredApprovals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            表示する項目がありません
          </div>
        ) : (
          filteredApprovals.map(approval => {
            const statusConfig = {
              pending: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800', label: '待機中' },
              approved: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-800', label: '承認済み' },
              rejected: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-800', label: '却下' },
            };
            const config = statusConfig[approval.status];

            return (
              <div
                key={approval.id}
                className={`${config.bg} border ${config.border} rounded-lg p-4`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{approval.taskName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
                        {config.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">ユーザーID</div>
                        <div className="font-medium text-gray-900">{approval.userId}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">獲得XP</div>
                        <div className="font-bold text-purple-600">{approval.xp} XP</div>
                      </div>
                      <div>
                        <div className="text-gray-600">報告日時</div>
                        <div className="text-gray-900">
                          {new Date(approval.createdAt).toLocaleString('ja-JP')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {approval.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(approval.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        承認
                      </button>
                      <button
                        onClick={() => handleReject(approval.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                      >
                        却下
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
