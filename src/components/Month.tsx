import Day from "./Day";

function Month(
  { v = 1, data = [], range = [1,31], startDay = 0 }: 
  { v?: number, data?: number[], range: number[], startDay: number }
) {

  const week = (wk: number) => {
    let w = [];
    for (let d = 1; d <= 7; d++) {
      const day = d+(wk*7)-startDay;
      if ((d === 1 && day > range[1]) || (d === 7 && day < range[0])) return [];
      w.push(
        <div key={day} style={day > range[1] || day < range[0] ? {visibility: 'hidden'} : {}}>
          <Day k={v+"-"+day} 
            v={data[day]} />
        </div>
      );
    }
    return w;
  };
  
  const days = (() => {
    const d = [];
    for (let wk = 0; wk < 6; wk++) {
      d.push(
        <div key={wk} style={{display:'inline-block'}}>
          {week(wk)}
        </div>
      );
    }
    return d;
  })();

  return (
    <div style={{display: 'inline-block', padding: '5px'}}>
      {days}
    </div>
  );
}

export default Month;