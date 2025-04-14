import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import style from './App.module.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Box className={style.container}>
      <Button variant='contained' onClick={() => setCount(x => x + 1)}>Счётчик: {count}</Button> 
    </Box>
  );
}

export default App;
