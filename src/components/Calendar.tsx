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
      m.push(<Month key={i} v={day.month} 
                start={day.weekday%7}
                data={calendar[day.year][day.month]} 
                max={day.daysInMonth} />);

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