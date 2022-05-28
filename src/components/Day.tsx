import styles from '../../styles/Day.module.scss';

function Day({ k, v = 0, colorCls }: { k: string, v: number, colorCls: string }) {
  return (
    <div className={`${styles.square} ${styles[colorCls]}`}> 
      <span className={styles.tooltip}>{v + " on " + k}</span>
    </div>
  );
}

export default Day;