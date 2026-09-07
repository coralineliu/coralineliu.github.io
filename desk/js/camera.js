// One cover-scaled camera keeps image, text and hit regions registered.
export function createCamera(stage, world, dialog) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
  let x=0, y=0, targetX=0, targetY=0, limitX=0, limitY=0, frame=0, down=null, wasDrag=false;
  function paint() {
    world.style.setProperty('--pan-x', x+'px');
    world.style.setProperty('--pan-y', y+'px');
  }
  function animate() {
    x+=(targetX-x)*.12; y+=(targetY-y)*.12; paint();
    if (Math.abs(targetX-x)+Math.abs(targetY-y)>.1) frame=requestAnimationFrame(animate);
    else { x=targetX; y=targetY; paint(); frame=0; }
  }
  function move(nextX, nextY) {
    targetX=clamp(nextX,limitX); targetY=clamp(nextY,limitY);
    if(reduced.matches) { x=targetX; y=targetY; paint(); }
    else if(!frame) frame=requestAnimationFrame(animate);
  }
  function layout() {
    const {width,height}=stage.getBoundingClientRect();
    // A small overscan protects the scene edge; no backdrop seams or distortion.
    const scale=Math.max(width/1672,height/941)*1.015;
    limitX=Math.max(0,(1672*scale-width)/2-2);
    limitY=Math.max(0,(941*scale-height)/2-2);
    world.style.setProperty('--fit',scale);
    x=clamp(x,limitX); y=clamp(y,limitY); paint(); move(x,y);
  }
  new ResizeObserver(layout).observe(stage); layout();
  stage.addEventListener('pointerdown',e=>{
    if(e.button!==0||dialog.open)return;
    down={x:e.clientX,y:e.clientY,px:x,py:y}; wasDrag=false;
  });
  stage.addEventListener('pointermove',e=>{
    if(dialog.open)return;
    if(down) {
      const dx=e.clientX-down.x,dy=e.clientY-down.y;
      if(Math.hypot(dx,dy)>6) {wasDrag=true;stage.classList.add('dragging');move(down.px+dx,down.py+dy);}
    } else if(e.pointerType==='mouse'&&!reduced.matches) {
      const r=stage.getBoundingClientRect();
      // Reach both ends before the pointer hits the viewport edge.
      move((.5-(e.clientX-r.left)/r.width)*2.5*limitX,(.5-(e.clientY-r.top)/r.height)*2.5*limitY);
    }
  });
  window.addEventListener('pointerup',()=>{down=null;stage.classList.remove('dragging');setTimeout(()=>{wasDrag=false;},0);});
  window.addEventListener('pointercancel',()=>{down=null;wasDrag=false;stage.classList.remove('dragging');});
  // Keyboard navigation also brings cropped edge objects into view.
  stage.addEventListener('focusin',e=>{
    const r=e.target.getBoundingClientRect(),s=stage.getBoundingClientRect();
    const dx=r.left<s.left+20?s.left+20-r.left:r.right>s.right-20?s.right-20-r.right:0;
    const dy=r.top<s.top+20?s.top+20-r.top:r.bottom>s.bottom-20?s.bottom-20-r.bottom:0;
    move(x+dx,y+dy);
  });
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;x=targetX;y=targetY;paint();});
  return {get wasDragging(){return wasDrag;}};
}