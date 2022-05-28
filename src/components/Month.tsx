import Day from "./Day";
import styles from '../../styles/Calendar.module.scss';
import { DateTime } from 'luxon';

const colorCls = ['none', 'darkgreen', 'green', 'lightgreen', 'lightestgreen'];

function Month(
  { data = {}, info = {} }: 
  { data?: any, info?: any }
) {
  const { startDayOfWeek, colorRange, range, year, month } = info;

  const week = (wk: number) => {
    let w = [];
    for (let d = 1; d <= 7; d++) {
      const day = d+(wk*7)-startDayOfWeek;
      if ((d === 1 && day > range[1]) || 
          (d === 7 && day < range[0])) return [];

      const date = DateTime.fromObject({year, month, day}).toLocaleString();
      
      const color = colorCls[colorRange.findIndex((c: number) => (data[day] || 0) <= c)];
      
      w.push(
        <div key={day} style={day > range[1] || day < range[0] ? {visibility: 'hidden'} : {}}>
          <Day k={date} v={data[day]} colorCls={color} />
        </div>
      );
    }
    return w;
  };
  
  const days = (() => {
    const d = [];
    for (let wk = 0; wk < 6; wk++) {
      d.push(
        <div key={wk} className={styles.week}>
          {week(wk)}
        </div>
      );
    }
    return d;
  })();

  return (
    <div className={styles.month}>
      <span className={styles['month-span']}>
        {DateTime.fromObject({month}).monthShort}
      </span>
      {days}
    </div>
  );
}

export default Month;