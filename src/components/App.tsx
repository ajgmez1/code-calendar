import axios from 'axios';
import { useEffect, useState } from 'react';
import Calendar from './Calendar';

interface CalendarData {
  lc: any;
  gh: any;
};

function App() {
  const [calendar, setCalendar] = useState<CalendarData>({} as CalendarData);
  
  useEffect(() => {
    axios.get('api/hello')
      .then((d) => {
        const { lc, gh } = d.data;
        
        console.log(lc);
        for (const k in lc.calendar) {
          console.log(k, lc.calendar[k]);
        }

        console.log(gh);
        for (const k in gh.calendar) {
          console.log(k, gh.calendar[k]);
        }
        setCalendar(d.data);
      });
  }, []);

  return (
    <div> 
      <Calendar data={calendar.lc} />
      <Calendar data={calendar.gh} />
    </div>
  );
}

export default App;