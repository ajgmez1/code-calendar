import Month from "./Month";

function Calendar({ data = {}, name }: { data: any, name?: string }) {
  const { calendar = {} } = data;

  const year = 2022;
  const leapYear = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
  const dInM = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  console.log(name, calendar);
  
  const Months = (() => {
    if (!calendar[year]) return;
    const m = [];
    for (let i = 0; i < 12; i++) {
      const day = new Date(year,i);
      m.push(<Month key={i} v={i+1} 
                start={day.getDay()}
                data={calendar[year][i+1]} 
                max={dInM[i]} />);
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