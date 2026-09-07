// Bounded mouse/drag motion. Content, outlines and labels move together.
export function createCamera(stage, world, dialog) {
  // Mouse movement follows a small damped angle. A drag adds a bounded offset;
  // releasing a drag must not activate the object underneath the pointer.
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobileQuery=matchMedia('(max-width:700px)');
  let currentX=0,currentY=0,targetX=0,targetY=0,offsetX=0,offsetY=0,frame=0,down=null,wasDrag=false;
  function layout(){const rect=stage.getBoundingClientRect();world.style.setProperty('--fit',Math.min(rect.width/1672,rect.height/941));}
  new ResizeObserver(layout).observe(stage);layout();
  function animate(){currentX+=(targetX-currentX)*.09;currentY+=(targetY-currentY)*.09;world.style.setProperty('--rx',currentX+'deg');world.style.setProperty('--ry',currentY+'deg');if(Math.abs(currentX-targetX)+Math.abs(currentY-targetY)>.003)frame=requestAnimationFrame(animate);else frame=0;}
  function move(x,y){if(reduced.matches||mobileQuery.matches)return;targetX=Math.max(-1.1,Math.min(1.1,x));targetY=Math.max(-1.8,Math.min(1.8,y));if(!frame)frame=requestAnimationFrame(animate);}
  stage.addEventListener('pointerdown',e=>{if(e.button!==0||mobileQuery.matches||dialog.open)return;down={x:e.clientX,y:e.clientY,ox:offsetX,oy:offsetY};wasDrag=false;});
  stage.addEventListener('pointermove',e=>{
    if(dialog.open||mobileQuery.matches)return;
    if(down){const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>6){wasDrag=true;stage.classList.add('dragging');offsetX=Math.max(-.8,Math.min(.8,down.ox-dy/230));offsetY=Math.max(-1.4,Math.min(1.4,down.oy+dx/230));move(offsetX,offsetY);}}
    else if(e.pointerType==='mouse'){const r=stage.getBoundingClientRect();move(offsetX+(.5-(e.clientY-r.top)/r.height)*.65,offsetY+((e.clientX-r.left)/r.width-.5)*1.15);}
  });
  window.addEventListener('pointerup',()=>{down=null;stage.classList.remove('dragging');setTimeout(()=>{wasDrag=false;},0);});
  window.addEventListener('pointercancel',()=>{down=null;wasDrag=false;stage.classList.remove('dragging');});
  stage.addEventListener('pointerleave',()=>{if(!down)move(offsetX,offsetY);});
  reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;currentX=currentY=targetX=targetY=offsetX=offsetY=0;world.style.setProperty('--rx','0deg');world.style.setProperty('--ry','0deg');}});
  return { get wasDragging() { return wasDrag; } };
}
