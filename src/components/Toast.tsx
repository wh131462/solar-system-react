import { useEffect, useState } from 'react';
import { useApp } from '../store/AppContext';

export default function Toast() {
  const { state } = useApp();
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (state.toastMessage) {
      setMsg(state.toastMessage); setVisible(true);
      const t = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(t);
    }
  }, [state.toastMessage]);

  return <div id="toast" className={visible ? 'show' : ''}>{msg}</div>;
}
