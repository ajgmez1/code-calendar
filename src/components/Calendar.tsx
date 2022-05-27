import Month from "./Month";
import { DateTime } from 'luxon';

function Calendar({ data = {}, name }: { data: any, name?: string }) {
  const { calendar = {} } = data;
  
  console.log(name, calendar);
  
  const Months = (() => {
    const m = [];
    let last = DateTime.now(); // change with params
    let first = last.minus({years: 1});
    if (!calendar[first.year]) return;

    let day = first;
    for (let i = 0; i <= 12; i++) {
      const start = i === 0 ? day.day : 1;
      const finish = i === 12 ? day.day : day.daysInMonth;
      const startDay = day.set({day:1}).weekday%7;
      
      m.push(<Month key={i} v={day.month} 
                startDay={startDay}
                data={calendar[day.year][day.month]} 
                range={[start, finish]} />);

      day = day.plus({months:1});
    }
    return m;
  })();

  return (
    <div style={{padding: '5px'}}> 
      {name} <br/>
      {Months}
    </div>
  );
}

export default Calendar;