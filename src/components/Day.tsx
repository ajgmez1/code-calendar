function Day({ k, v = 0 }: { k: string, v: number }) {
  return (
    <div style={{border:'1px solid black', padding: '3px'}}> 
      {v} 
    </div>
  );
}

export default Day;