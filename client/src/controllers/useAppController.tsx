import { useEffect, useMemo, useRef, useState } from 'react';
import { Role, Priority, TaskStatus, User, Shift, ShiftPattern, Task, GachaLog, Notification, USERS_INITIAL, SHIFTS_INITIAL, SHIFT_PATTERNS_INITIAL, TASKS_INITIAL } from '../models';

export default function useAppController() {
  const [selectedRole, setSelectedRole] = useState<'staff' | 'part'>('staff');
  const [loginUserId, setLoginUserId] = useState<number | ''>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS_INITIAL);
  const [shifts, setShifts] = useState<Shift[]>(SHIFTS_INITIAL);
  const [shiftPatterns, setShiftPatterns] = useState<ShiftPattern[]>(SHIFT_PATTERNS_INITIAL);
  const [tasks, setTasks] = useState<Task[]>(TASKS_INITIAL);
  const [gLog, setGLog] = useState<GachaLog[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [gachaEnabled, setGachaEnabled] = useState(true);
  const [speedMode, setSpeedMode] = useState<'normal' | 'fast' | 'skip'>('normal');
  const [cy, setCy] = useState(2025);
  const [cm, setCm] = useState(5);
  const [tFilter, setTFilter] = useState<TaskStatus | 'all'>('all');
  const [activePage, setActivePage] = useState<'dashboard' | 'shift' | 'shift-request' | 'task' | 'gacha' | 'approval' | 'gacha-settings' | 'staff' | 'notifications'>('dashboard');
  const [modal, setModal] = useState<string | null>(null);
  const [toastText, setToastText] = useState('');
  const [gachaLabel, setGachaLabel] = useState('タスクを引いてみよう…');
  const [gachaResult, setGachaResult] = useState<Task | null>(null);
  const [gachaLock, setGachaLock] = useState(false);
  const [reqDate, setReqDate] = useState(new Date().toISOString().slice(0,10));
  const [reqStart, setReqStart] = useState('09:00');
  const [reqEnd, setReqEnd] = useState('17:00');
  const [reqOff, setReqOff] = useState(false);
  const [reqNote, setReqNote] = useState('');
  const [csUid, setCsUid] = useState<number>(USERS_INITIAL[0]?.id ?? 1);
  const [csDate, setCsDate] = useState(new Date().toISOString().slice(0,10));
  const [csStart, setCsStart] = useState('09:00');
  const [csEnd, setCsEnd] = useState('17:00');
  const [ctName, setCtName] = useState('');
  const [ctDesc, setCtDesc] = useState('');
  const [ctPri, setCtPri] = useState<Priority>('mid');
  const [ctXp, setCtXp] = useState(50);
  const [asName, setAsName] = useState('');
  const [asRole, setAsRole] = useState<Role>('part');
  const [assignTaskId, setAssignTaskId] = useState<number | null>(null);
  const [assignUid, setAssignUid] = useState<number>(USERS_INITIAL.find((u) => u.role === 'part')?.id ?? 1);
  const toastTimer = useRef<number | null>(null);
  const gachaInterval = useRef<number | null>(null);
  const gachaTimeout = useRef<number | null>(null);

  const userOptions = useMemo(() => (
    selectedRole === 'staff'
      ? users.filter((user) => user.role !== 'part')
      : users.filter((user) => user.role === 'part')
  ), [selectedRole, users]);

  const isMgr = currentUser?.role === 'manager';
  const isStf = currentUser && (currentUser.role === 'manager' || currentUser.role === 'staff');
  const approvalCount = tasks.filter((task) => task.st === 'review').length;

  useEffect(() => {
    if (!toastText) return;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastText(''), 2600);
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [toastText]);

  useEffect(() => {
    return () => {
      if (gachaInterval.current) window.clearInterval(gachaInterval.current);
      if (gachaTimeout.current) window.clearTimeout(gachaTimeout.current);
    };
  }, []);

  const toast = (message: string) => {
    setToastText(message);
  };

  const unreadCount = notifications.filter((item: Notification) => !item.read && (currentUser?.role === 'manager' ? true : item.uid === currentUser?.id)).length;
  const toggleNotif = () => setNotificationOpen((prev: boolean) => !prev);
  const readNotif = (id: number) => setNotifications((prev: Notification[]) => prev.map((item: Notification) => item.id === id ? { ...item, read: true } : item));
  const clearNotifs = () => {
    if (!currentUser) return;
    setNotifications((prev: Notification[]) => prev.map((item: Notification) => currentUser.role === 'manager' || item.uid === currentUser.id ? { ...item, read: true } : item));
  };
  const toggleGachaEnabled = () => setGachaEnabled((prev: boolean) => !prev);
  const toggleTaskPool = (taskId: number) => setTasks((prev: Task[]) => prev.map((task: Task) => task.id === taskId ? { ...task, inPool: !task.inPool } : task));

  const addNotification = (title: string, sub: string, uid: number) => {
    setNotifications((prev: Notification[]) => [{ id: Date.now(), title, sub, read: false, uid }, ...prev]);
  };

  const handleLogin = () => {
    if (!loginUserId) {
      toast('アカウントを選択してください');
      return;
    }

    const selectedUser = users.find((user) => user.id === loginUserId) ?? null;
    if (!selectedUser) {
      toast('アカウントが見つかりません');
      return;
    }

    setCurrentUser(selectedUser);
    setActivePage('dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage('dashboard');
    setLoginUserId('');
    setSelectedRole('staff');
    setNotificationOpen(false);
    setGachaLabel('タスクを引いてみよう…');
    setGachaResult(null);
    setGachaLock(false);
  };

  const handleNav = (page: typeof activePage) => {
    setActivePage(page);
  };

  const availableUsers = useMemo(() => (
    users.filter((user) => user.role === 'part')
  ), [users]);

  const activeNavItems = useMemo(() => [
    { id: 'dashboard', lbl: 'ダッシュボード', ic: 'home' },
    { id: 'shift', lbl: 'シフト管理', ic: 'cal' },
    { id: 'task', lbl: 'タスク管理', ic: 'check' },
    { id: 'gacha', lbl: '闇鍋ガチャ', ic: 'dice', partOnly: true },
    { id: 'approval', lbl: '完了承認', ic: 'shield', mgrOnly: true },
    { id: 'gacha-settings', lbl: 'ガチャ設定', ic: 'settings', mgrOnly: true },
    { id: 'staff', lbl: 'スタッフ管理', ic: 'users', mgrOnly: true },
    { id: 'notifications', lbl: '通知', ic: 'bell' },
  ].filter((item) => {
    if (item.mgrOnly && !isMgr) return false;
    if (item.partOnly && currentUser?.role === 'manager') return false;
    return true;
  }), [currentUser, isMgr]);

  const todayIso = new Date().toISOString().slice(0, 10);

  const dashboardStats = (shiftsParam: Shift[], tasksParam: Task[], currentUserParam: User | null, isMgrParam: boolean, approvalCountParam: number) => {
    const todShifts = shiftsParam.filter((shift) => shift.date === todayIso && shift.st === 'confirmed');
    const myTasks = currentUserParam ? tasksParam.filter((task) => task.to === currentUserParam.id && task.st !== 'done') : [];

    return { todShifts, myTasks, approvalCountParam };
  };

  const renderTodayShifts = (shiftsParam: Shift[], usersParam: User[], currentUserParam: User | null) => {
    const todShifts = shiftsParam.filter((shift) => shift.date === todayIso && shift.st === 'confirmed');
    if (!todShifts.length) {
      return null;
    }

    return todShifts.map((shift) => {
      const user = usersParam.find((item) => item.id === shift.uid) ?? { name: '?', ini: '?' };
      const isMine = shift.uid === currentUserParam?.id;
      return { shift, user, isMine };
    });
  };

  const dashboardTasks = (tasksParam: Task[], currentUserParam: User | null, isMgrParam: boolean) => {
    if (!currentUserParam) return null;
    const showT = isMgrParam ? tasksParam.filter((task) => task.st !== 'done').slice(0, 5) : tasksParam.filter((task) => task.to === currentUserParam.id && task.st !== 'done').slice(0, 5);
    return showT;
  };

  const renderCalendar = (cyState: number, cmState: number, shiftsParam: Shift[], usersParam: User[], currentUserParam: User | null) => {
    const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const firstDay = new Date(cyState, cmState, 1).getDay();
    const daysInMonth = new Date(cyState, cmState + 1, 0).getDate();
    const prevMonthDays = new Date(cyState, cmState, 0).getDate();
    const dayNames = ['日','月','火','水','木','金','土'];
    const cells: any[] = [];

    for (let i = 0; i < firstDay; i += 1) {
      const dateNumber = prevMonthDays - firstDay + 1 + i;
      cells.push({ type: 'prev', dateNumber });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${cyState}-${String(cmState + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayShifts = shiftsParam.filter((shift) => shift.date === dateKey && shift.st === 'confirmed');
      const myShift = dayShifts.find((shift) => shift.uid === currentUserParam?.id);
      const isToday = dateKey === todayIso;
      cells.push({ type: 'day', day, dateKey, dayShifts, myShift, isToday });
    }

    const usedCells = firstDay + daysInMonth;
    const extraCells = Math.ceil(usedCells / 7) * 7 - usedCells;
    for (let i = 1; i <= extraCells; i += 1) {
      cells.push({ type: 'next', dateNumber: i });
    }

    return { monthNames, dayNames, cells };
  };

  const shiftTableRows = (shiftsParam: Shift[], usersParam: User[], currentUserParam: User | null, isMgrParam: boolean) => {
    const list = isMgrParam
      ? [...shiftsParam].sort((a, b) => a.date.localeCompare(b.date))
      : shiftsParam.filter((shift) => shift.uid === currentUserParam?.id).sort((a, b) => a.date.localeCompare(b.date));

    return list.map((shift) => {
      const user = usersParam.find((item) => item.id === shift.uid) ?? { name: '?' };
      const badge = shift.st === 'confirmed'
        ? { label: '確定', cls: 'b b-green' }
        : { label: '希望', cls: 'b b-orange' };
      return { shift, user, badge };
    });
  };

  const taskList = (tasksParam: Task[], currentUserParam: User | null, isMgrParam: boolean, isStfParam: boolean, tFilterParam: TaskStatus | 'all') => {
    let list = isMgrParam || isStfParam ? tasksParam : tasksParam.filter((task) => task.to === currentUserParam?.id || !task.to);
    if (tFilterParam !== 'all') list = list.filter((task) => task.st === tFilterParam);
    return list;
  };

  const gachaTask = (tasksParam: Task[], currentUserParam: User | null) => tasksParam.find((task) => task.to === currentUserParam?.id && task.st !== 'done');

  const handleShiftRequestSubmit = (currentUserParam: User | null, date: string, s: string, e: string, setShiftsFn: (fn:any)=>void, setModalFn:(m:any)=>void, toastFn:(m:string)=>void) => {
    if (!date||!s||!e){toastFn('日付と時間を入力してください');return;}
    if (!currentUserParam) return;
    setShiftsFn((prev:any)=>[...prev,{id:Date.now(),uid:currentUserParam.id,date,s,e,st:'request',isOff:reqOff}]);
    setModalFn(null);toastFn('シフト希望を提出しました');
  };

  const handleShiftCreateSubmit = (csUidParam:number, csDateParam:string, csStartParam:string, csEndParam:string, setShiftsFn:(fn:any)=>void, setModalFn:(m:any)=>void, toastFn:(m:string)=>void) => {
    if (!csDateParam||!csStartParam||!csEndParam){toastFn('入力を確認してください');return;}
    setShiftsFn((prev:any)=>[...prev,{id:Date.now(),uid:csUidParam,date:csDateParam,s:csStartParam,e:csEndParam,st:'confirmed'}]);
    setModalFn(null);toastFn('シフトを作成しました');
    addNotification('シフトが確定しました', `${csDateParam} ${csStartParam}-${csEndParam} のシフトが確定されました`, csUidParam);
  };

  const RARITY: Record<string, { label: string; weight: number }> = {
    S: { label: 'SUPER', weight: 1 },
    A: { label: 'RARE', weight: 4 },
    B: { label: 'UNCOMMON', weight: 15 },
    C: { label: 'NORMAL', weight: 80 },
  };

  const pickRarity = () => {
    const total = Object.values(RARITY).reduce((s, r) => s + r.weight, 0);
    let v = Math.floor(Math.random() * total);
    for (const key of Object.keys(RARITY)) {
      const r = RARITY[key];
      if (v < r.weight) return key;
      v -= r.weight;
    }
    return 'C';
  };

  const handleTaskStart = (id:number, setTasksFn:(fn:any)=>void, toastFn:(m:string)=>void) => { setTasksFn((prev:any)=>prev.map((task:any)=>task.id===id?{...task,st:'in_progress'}:task)); toastFn('タスクを開始しました'); };
  const handleRequestDone = (id:number, setTasksFn:(fn:any)=>void, toastFn:(m:string)=>void) => { 
    setTasksFn((prev:any)=>prev.map((task:any)=>task.id===id?{...task,st:'review'}:task)); 
    toastFn('完了申請を送信しました');
    const task = tasks.find((item) => item.id === id);
    if (task) addNotification('タスク完了報告があります', `「${task.name}」の完了報告が届いています`, 1);
  };
  const openAssignModal = (taskId:number, usersParam:User[], setAssignTaskIdFn:(n:number|null)=>void, setAssignUidFn:(n:number)=>void, setModalFn:(m:any)=>void) => { const partUser=usersParam.find((u)=>u.role==='part'); setAssignTaskIdFn(taskId); setAssignUidFn(partUser?.id??1); setModalFn('modal-assign'); };
  const handleAssignSubmit = (assignTaskIdParam:number|null, assignUidParam:number, setTasksFn:(fn:any)=>void, setModalFn:(m:any)=>void, usersParam:User[], toastFn:(m:string)=>void) => { if (!assignTaskIdParam) return; setTasksFn((prev:any)=>prev.map((task:any)=>task.id===assignTaskIdParam?{...task,to:assignUidParam,st:'in_progress'}:task)); const assignedUser = usersParam.find((u)=>u.id===assignUidParam); setModalFn(null); toastFn(`${assignedUser?.name ?? 'スタッフ'}に割り当てました`); };
  const handleTaskDelete = (id:number, setTasksFn:(fn:any)=>void, toastFn:(m:string)=>void) => { setTasksFn((prev:any)=>prev.filter((task:any)=>task.id!==id)); toastFn('削除しました'); };
  const handleTaskCreateSubmit = (ctNameParam:string, ctDescParam:string, ctPriParam:Priority, ctXpParam:number, currentUserParam:User | null, setTasksFn:(fn:any)=>void, setModalFn:(m:any)=>void, toastFn:(m:string)=>void) => { if (!ctNameParam.trim()){ toastFn('タスク名を入力してください'); return; } if (!currentUserParam) return; setTasksFn((prev:any)=>[...prev,{id:Date.now(),name:ctNameParam.trim(),desc:ctDescParam.trim(),pri:ctPriParam,xp:ctXpParam,st:'pending',to:null,by:currentUserParam.id,inPool:true}]); setModalFn(null); toastFn('タスクを追加しました'); };

  const finalizeGachaDraw = (chosen: Task, currentUserParam: User, rkey: string, rarityLabel: string, setTasksFn:(fn:any)=>void, setGachaLabelFn:(s:string)=>void, setGachaResultFn:(t:Task|null)=>void, setGLogFn:(fn:any)=>void, toastFn:(m:string)=>void, setGachaLockFn:(b:boolean)=>void) => {
    setTasksFn((prev:any) => prev.map((task:any) => task.id === chosen.id ? { ...task, st: 'in_progress', to: currentUserParam.id } : task));
    setGachaLabelFn(chosen.name);
    setGachaResultFn({ ...chosen, to: currentUserParam.id, st: 'in_progress' });
    setGLogFn((prev:any) => [...prev, { name: chosen.name, xp: chosen.xp, timestamp: Date.now(), rarity: rarityLabel, rkey, time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) }]);
    toastFn(`「${chosen.name}」が当たりました`);
    setGachaLockFn(false);
  };

  const skipGacha = () => {
    if (!gachaLock) return;
    if (gachaInterval.current) window.clearInterval(gachaInterval.current);
    if (gachaTimeout.current) window.clearTimeout(gachaTimeout.current);
    gachaInterval.current = null;
    gachaTimeout.current = null;
    if (!currentUser) {
      setGachaLock(false);
      return;
    }
    const avail = tasks.filter((task) => task.st === 'pending' && !task.to && task.inPool);
    if (!avail.length) {
      setGachaLock(false);
      toast('引けるタスクがありません');
      return;
    }
    const rk = pickRarity();
    const rc = RARITY[rk];
    const chosen = avail[Math.floor(Math.random() * avail.length)];
    finalizeGachaDraw(chosen, currentUser, rk.toLowerCase(), rc.label, setTasks, setGachaLabel, setGachaResult, setGLog, toast, setGachaLock);
  };

  const handleGacha = (tasksParam:Task[], currentUserParam:User | null, setTasksFn:(fn:any)=>void, setGachaLabelFn:(s:string)=>void, setGachaResultFn:(t:Task|null)=>void, setGLogFn:(fn:any)=>void, toastFn:(m:string)=>void, setGachaLockFn:(b:boolean)=>void, gachaIntervalRef:any, gachaTimeoutRef:any) => {
    const avail = tasksParam.filter((task)=>task.st==='pending'&& !task.to);
    if (!avail.length){ toastFn('引けるタスクがありません'); return; }
    if (!currentUserParam) return;
    setGachaLockFn(true);
    setGachaResultFn(null);
    const pool = [...avail.map((task)=>task.name),'？？？','ランダム選出中…','🎲 運命のタスク'];
    let pointer=0;
    if (gachaIntervalRef.current) window.clearInterval(gachaIntervalRef.current);
    // animation interval and timeout depend on speedMode state
    const interval = speedMode === 'fast' ? 60 : 140;
    const timeout = speedMode === 'fast' ? 800 : 2200;
    if (gachaTimeoutRef.current) window.clearTimeout(gachaTimeoutRef.current);

    const rk = pickRarity();
    const rc = RARITY[rk];

    if (speedMode === 'skip') {
      const chosen = avail[Math.floor(Math.random() * avail.length)];
      finalizeGachaDraw(chosen, currentUserParam, rk.toLowerCase(), rc.label, setTasksFn, setGachaLabelFn, setGachaResultFn, setGLogFn, toastFn, setGachaLockFn);
      return;
    }

    gachaIntervalRef.current = window.setInterval(()=>{ setGachaLabelFn(pool[pointer%pool.length]); pointer+=1; }, interval);

    gachaTimeoutRef.current = window.setTimeout(() => {
      if (gachaIntervalRef.current) window.clearInterval(gachaIntervalRef.current);
      gachaIntervalRef.current = null;
      const chosen = avail[Math.floor(Math.random() * avail.length)];
      finalizeGachaDraw(chosen, currentUserParam, rk.toLowerCase(), rc.label, setTasksFn, setGachaLabelFn, setGachaResultFn, setGLogFn, toastFn, setGachaLockFn);
    }, timeout);
  };

  const handleApproval = (id:number, approved:boolean, setTasksFn:(fn:any)=>void, tasksParam:Task[], setUsersFn:(fn:any)=>void, toastFn:(m:string)=>void) => {
    setTasksFn((prev:any)=>prev.map((task:any)=>task.id===id?{...task,st: approved? 'done':'in_progress'}:task));
    if (approved){
      const task = tasksParam.find((item)=>item.id===id);
      if (task?.to){ 
        setUsersFn((prev:any)=>prev.map((user:any)=>user.id===task.to?{...user,xp:user.xp+task.xp}:user)); 
        addNotification('タスクが承認されました', `「${task.name}」が承認され +${task.xp} XPが付与されました`, task.to);
      }
      toastFn('承認しました');
    } else { toastFn('却下しました'); }
  };

  const handleStaffCreate = (asNameParam:string, asRoleParam:Role, setUsersFn:(fn:any)=>void, setModalFn:(m:any)=>void, toastFn:(m:string)=>void) => {
    if (!asNameParam.trim()){ toastFn('名前を入力してください'); return; }
    setUsersFn((prev:any)=>[...prev,{ id: Date.now(), name: asNameParam.trim(), role: asRoleParam, xp:0, ini: asNameParam.trim().charAt(0)||'S' }]);
    setModalFn(null); toastFn('スタッフを追加しました');
  };

  const approvalTasks = tasks.filter((task)=>task.st==='review');

  const staffStats = (usersParam:User[]) => {
    const total = usersParam.length;
    const partCount = usersParam.filter((user)=>user.role==='part').length;
    const staffCount = total - partCount;
    return { total, partCount, staffCount };
  };

  return {
    selectedRole, setSelectedRole, loginUserId, setLoginUserId, currentUser, setCurrentUser,
    users, setUsers, shifts, setShifts, shiftPatterns, setShiftPatterns, tasks, setTasks, gLog, setGLog,
    cy, setCy, cm, setCm, tFilter, setTFilter, activePage, setActivePage, modal, setModal,
    toastText, setToastText, gachaLabel, setGachaLabel, gachaResult, setGachaResult, gachaLock, setGachaLock,
    gachaEnabled, setGachaEnabled, speedMode, setSpeedMode, notificationOpen, setNotificationOpen, notifications, setNotifications, unreadCount, toggleNotif, readNotif, clearNotifs, toggleGachaEnabled, toggleTaskPool,
    reqDate, setReqDate, reqStart, setReqStart, reqEnd, setReqEnd, reqOff, setReqOff, reqNote, setReqNote,
    csUid, setCsUid, csDate, setCsDate, csStart, setCsStart, csEnd, setCsEnd,
    ctName, setCtName, ctDesc, setCtDesc, ctPri, setCtPri, ctXp, setCtXp,
    asName, setAsName, asRole, setAsRole, assignTaskId, setAssignTaskId, assignUid, setAssignUid,
    toast, handleLogin, logout, handleNav, userOptions, isMgr, isStf, approvalCount,
    availableUsers, activeNavItems, todayIso, dashboardStats, renderTodayShifts, dashboardTasks,
    renderCalendar, shiftTableRows, taskList, gachaTask, handleShiftRequestSubmit, handleShiftCreateSubmit,
    handleTaskStart, handleRequestDone, openAssignModal, handleAssignSubmit, handleTaskDelete, handleTaskCreateSubmit,
    handleGacha, skipGacha, handleApproval, handleStaffCreate, approvalTasks, staffStats,
    toastTimer, gachaInterval, gachaTimeout,
  } as const;
}
