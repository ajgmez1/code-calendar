import Day from "./Day";

function Month({ v, data = [], max = 31 }: { v?: number, data?: number[], max: number }) {

  const nthDayOfWeek = (d: number) => {
    let w = [];
    for (let wk = 0; wk < 5; wk++) {
      const day = d+1+(wk*7);
      if (day <= max) {
        w.push(
          <Day key={wk} k={v+"-"+day} v={data[day]} />
        );
      }
    }
    return w;
  };
  
  const days = (() => {
    const d = [];
    for (let i = 0; i < 7; i++) {
      d.push(
        <div key={i} style={{padding: '3px'}}>
          {nthDayOfWeek(i)}
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