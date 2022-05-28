import Month from "./Month";
import styles from '../../styles/Calendar.module.scss';

function Calendar({ data = {}, name }: { data: any, name?: string }) {
  const { calendar = {} } = data;

  return (
    <div className={styles.calendar}> 
      <h2>{name}</h2>
      {Object.entries(calendar).map(([k, v]) => (
        <Month key={k} info={v.info} data={v.data}  />
      ))}
    </div>
  );
}

export default Calendar;