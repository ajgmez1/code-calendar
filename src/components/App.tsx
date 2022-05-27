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
    axios.get('api/calendars')
      .then((d) => {
        setCalendar(d.data);
      });
  }, []);

  return (
    <div> 
      <Calendar data={calendar.gh} name={"GitHub"} />
      <Calendar data={calendar.lc} name={"LeetCode"} />
    </div>
  );
}

export default App;