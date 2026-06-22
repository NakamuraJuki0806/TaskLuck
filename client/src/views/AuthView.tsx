import { type ReactNode } from 'react';
import { Priority, TaskStatus, User } from '../models';

type AuthViewProps = {
  loginUserId: number | '';
  setLoginUserId: (value: number | '') => void;
  handleLogin: () => void;
};

export function AuthView({ loginUserId, setLoginUserId, handleLogin }: AuthViewProps) {
  return (
    <div id="login-screen">
      <div className="lbox">
        <img src="/favicon.png" alt="TaskLuck" className="llogo" />
        <h2>ユーザーIDを入力してログイン</h2>
        <div className="fg">
          <label>ユーザーID</label>
          <input
            type="text"
            value={loginUserId}
            onChange={(event) => setLoginUserId(event.target.value ? Number(event.target.value) : '')}
            onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
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
