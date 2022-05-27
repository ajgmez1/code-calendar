import Month from "./Month";

function Calendar({ data = {}, name }: { data: any, name?: string }) {
  const { calendar = {} } = data;
  
  return (
    <div style={{padding: '5px'}}> 
      {name} <br/>
      {Object.entries(calendar).map(([k, v]) => (
        <Month key={k} v={v.info.month} 
          startDay={v.info.startDayOfWeek}
          data={v.data} 
          range={v.info.range} />
      ))}
    </div>
  );
}

export default Calendar;