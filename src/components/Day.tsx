
function Day({ k, v = 0 }: { k: string, v: number }) {
  return (
    <span style={{border:'1px solid black', padding: '3px'}}> 
      {v} 
    </span>
  );
}

export default Day;