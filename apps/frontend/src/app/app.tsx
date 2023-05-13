// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { Button } from '@snipstash/shared/ui';
import axios from 'axios';
import { useEffect, useState } from 'react';

export function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  useEffect(() => {
    async function getMessage() {
      const res = await axios.get('api');
      setMessage(res.data.message);
    }

    getMessage();
  }, []);
  return (
    <div className="mt-16  flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-violet-500">
        {count} - {message}
      </h1>
      <Button onClick={() => setCount((old) => old + 1)}>Increment</Button>
    </div>
  );
}

export default App;
