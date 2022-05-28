import Month from "./Month";
import styles from '../../styles/Calendar.module.scss';

function Calendar(
  { data = {}, name, type }: 
  { data: any, name: string, type: string }
) {
  const { calendar = {}, count } = data;
  const yearStr = 'the last year';

  return (
    <div className={styles.calendar}> 
      <div className={styles.header}>
        <h2>{name}</h2> <p>{count} {type} in {yearStr}</p>
      </div>
      {Object.entries(calendar).map(([k, v]) => (
        <Month key={k} info={v.info} data={v.data}  />
      ))}
    </div>
  );
}

export default Calendar;