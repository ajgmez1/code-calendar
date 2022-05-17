import axios from 'axios';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    axios.get('api/hello')
      .then((d) => {
        const calendar = d.data;
        const dates = JSON.parse(calendar.submissionCalendar);
        console.log(calendar);
        console.log(calendar.activeYears);
        console.log(JSON.parse(calendar.submissionCalendar));

        for (const k in dates) {
          console.log(k, new Date(k*1000));
        }
        
      });
  }, []);

  return (
    <div> App </div>
  );
}

export default App;