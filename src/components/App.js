import axios from 'axios';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    axios.get('api/hello')
      .then((d) => console.log(d));
  }, []);

  return (
    <div> App </div>
  );
}

export default App;