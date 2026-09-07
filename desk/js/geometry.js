// Project flat content onto the four corners of its photographed surface.
export function project(width, height, points) {
  const src = [[0,0],[width,0],[width,height],[0,height]], rows=[];
  src.forEach(([x,y],i)=>{const [u,v]=points[i];rows.push([x,y,1,0,0,0,-u*x,-u*y,u],[0,0,0,x,y,1,-v*x,-v*y,v]);});
  for(let col=0;col<8;col++){
    let best=col;for(let r=col+1;r<8;r++)if(Math.abs(rows[r][col])>Math.abs(rows[best][col]))best=r;
    [rows[col],rows[best]]=[rows[best],rows[col]];
    const divisor=rows[col][col];for(let j=col;j<9;j++)rows[col][j]/=divisor;
    for(let r=0;r<8;r++)if(r!==col){const f=rows[r][col];for(let j=col;j<9;j++)rows[r][j]-=f*rows[col][j];}
  }
  const [a,b,c,d,e,f,g,h]=rows.map(r=>r[8]);
  return `matrix3d(${a},${d},0,${g},${b},${e},0,${h},0,0,1,0,${c},${f},0,1)`;
}
