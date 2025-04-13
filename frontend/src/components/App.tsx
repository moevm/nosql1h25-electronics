import { useState } from 'react';
import style from './App.module.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={style.container}>
      <button className={style.counter} onClick={() => setCount(x => x + 1)}>Счётчик: {count}</button> 
    </div>
  );
}

export default App;
