import Day from "./Day";

function Month(
  { v = 1, data = [], max = 31, start = 0 }: 
  { v?: number, data?: number[], max: number, start: number }
) {

  const week = (wk: number) => {
    let w = [];
    for (let d = 1; d <= 7; d++) {
      const day = d+(wk*7)-start;
      if (d === 1 && day > max) return w;
      w.push(
        <div key={day} style={day > max || day < 1 ? {visibility: 'hidden'} : {}}>
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