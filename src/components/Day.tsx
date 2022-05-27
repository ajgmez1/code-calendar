import styles from '../../styles/Day.module.scss';

function Day({ k, v = 0 }: { k: string, v: number }) {
  return (
    <div className={styles.square}> 
      {v} <span className={styles.tooltip}>{k}</span>
    </div>
  );
}

export default Day;