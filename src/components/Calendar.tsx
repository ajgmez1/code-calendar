
function Calendar({ data = {} }: { data: any }) {
  const { calendar = {} } = data;
  const d = Object.entries(calendar);

  return (
    <div style={{border:'1px solid black', padding: '5px'}}> 
      {d.map(([k,v]: [string, any]) => (
        <p key={k}><span> {k} </span><span> {v} </span></p>
      ))}
    </div>
  );
}

export default Calendar;