import { project } from './geometry.js';
import { asset, esc } from './utils.js';

// All coordinates use the same 1672 × 941 scene, including mobile crops.
export function buildScene(data, surfaces) {
  const rick = data.projects.find(p => p.title === 'Rick and Morty Episodes');
  function surface(id,width,height,corners,html) {
    const el=document.createElement('div');el.className='surface';el.id=id;
    el.style.width=width+'px';el.style.height=height+'px';el.style.transform=project(width,height,corners);el.innerHTML=html;surfaces.append(el);
  }
  surface('portrait',300,300,[[307,453],[465,453],[465,627],[307,627]],`<img class="portrait" src="${asset(data.profile.avatar)}" alt="">`);
  surface('quote-card',260,190,[[1082,520],[1202,531],[1199,618],[1080,607]],`<blockquote class="desk-quote"><em>${esc(data.profile.quote)}</em></blockquote>`);
  surface('laptop-screen',600,350,[[649,368],[1008,366],[1013,585],[649,586]],`<div class="screen"><h3 class="screen-title">${esc(rick.title)}</h3><img src="${asset(rick.wideImage)}" alt=""></div>`);
  // One original month is legible at this physical screen size; the full diary
  // remains available in the preview. Do not squeeze the annual poster into it.
  surface('phone-screen',240,450,[[359,708],[433,697],[501,768],[417,784]],`<div class="phone-page"><h3>Mood Diary</h3><p class="phone-date">JANUARY 2024</p><svg viewBox="480 288 130 145" xmlns="http://www.w3.org/2000/svg"><image href="${asset('projects/data-diary-of-mood/detail.png')}" width="1581" height="995"/></svg></div>`);
  data.publications.slice(0,2).forEach((paper,i)=>{
    const corners=i===0?[[1167,69],[1335,71],[1329,295],[1166,293]]:[[1384,74],[1534,76],[1527,303],[1376,300]];
    surface('paper-'+i,250,338,corners,`<div class="paper-content"><h3>${esc(paper.title)}</h3><p class="authors">${esc(paper.authors)}</p><div class="rule"></div><img src="${asset(paper.thumbnail)}" alt=""><p class="venue">${esc(paper.venue)}</p>${paper.award?`<p class="detail">${esc(paper.award)}</p>`:''}</div>`);
  });
  surface('journal-left',260,230,[[678,714],[836,718],[835,837],[649,839]],`<div class="journal-page"><p class="journal-date">${esc(data.blog[0].date)}</p><h3>${esc(data.blog[0].title)}</h3><p>我们在关心同样的事情，<br>我们同呼吸，共好奇。</p></div>`);
  surface('journal-right',260,230,[[857,721],[1016,725],[1042,838],[860,838]],`<div class="journal-page"><h3 class="blog-link">${esc(data.blog[1].title)}</h3><p class="journal-date">${esc(data.blog[1].date)}</p><h3 class="blog-link">${esc(data.blog[2].title)}</h3><p class="journal-date">${esc(data.blog[2].date)}</p></div>`);
  // Each title follows its own physical spine, in top-to-bottom book order.
  const bookCorners=[[[1294,477],[1520,515],[1518,544],[1291,505]],[[1281,515],[1519,555],[1517,586],[1278,547]],[[1270,557],[1519,598],[1517,637],[1267,589]]];
  ['Data Sketches','Visualize This','Normal People'].forEach((title,i)=>surface('book-spine-'+i,250,36,bookCorners[i],`<div class="book-spine ${i===1?'light':''}">${title}</div>`));

  const objects = [
    {id:'about',section:'about',title:'About',path:'M386 442C438 442 481 486 481 539C481 594 438 639 386 639C371 639 357 636 345 630L313 629 325 609C305 591 293 567 293 539C293 486 335 442 386 442Z',label:[386,672],crop:[278,430,218,222]},
    {id:'quote',section:'about',title:'Motto',path:'M1077 515L1209 526 1212 617 1204 625 1073 611Z',label:[1143,490],crop:[1057,499,171,140]},
    {id:'rick',section:'projects',title:'Projects',path:'M650 355L1008 353Q1021 353 1021 368L1026 593 1054 681Q1057 697 1033 699L621 700Q603 698 604 685L637 594 638 369Q638 355 650 355Z',label:[834,325],crop:[590,340,480,370]},
    {id:'mood',section:'projects',title:'Mood Diary',path:'M354 700L429 687Q442 684 450 695L512 764Q521 780 505 785L422 799Q408 802 399 790L349 719Q342 706 354 700Z',label:[432,825],crop:[329,672,205,142]},
    {id:'paper-0',section:'publications',title:'FlawViz',path:'M1153 47L1351 47 1343 314 1149 314Z',label:[1248,341],crop:[1138,36,223,290]},
    {id:'paper-1',section:'publications',title:'DiagramLens',path:'M1371 50L1547 51 1538 320 1364 317Z',label:[1457,346],crop:[1353,39,205,293]},
    {id:'blog',section:'blog',title:'Blog',path:'M669 707Q756 690 847 711Q920 699 1027 713L1068 863Q946 869 848 863Q743 869 627 859Z',label:[839,890],crop:[610,682,475,201]},
    {id:'contact',section:'about',title:'Contact Me',path:'M1057 728Q1062 726 1066 734L1106 850 1103 860 1097 854 1053 740Q1051 732 1057 728Z',label:[1138,880],crop:[1025,712,108,166]},
    {id:'books',section:'misc',title:'Books',path:'M1290 470L1380 454 1596 484 1589 520 1601 530 1598 565 1611 573 1608 609 1525 646 1264 590 1267 561 1278 551 1278 509 1287 507Z',label:[1508,679],crop:[1253,440,372,218]},
    {id:'music',section:'misc',title:'Music',path:'M1208 633Q1301 619 1387 648Q1441 672 1444 719Q1440 755 1400 775L1343 780Q1302 806 1253 785Q1224 776 1211 749Q1173 741 1165 706Q1159 667 1208 633Z',label:[1310,832],crop:[1153,615,304,192]},
    {id:'climbing',section:'misc',title:'Bouldering',path:'M1481 754Q1509 729 1542 743Q1564 751 1595 795Q1606 815 1587 826Q1563 833 1544 818L1488 781Q1477 773 1481 754Z M1500 764L1557 806Q1568 814 1580 805L1542 759Q1519 747 1500 764Z',label:[1542,861],crop:[1462,720,153,127]}
  ];
  return objects;
}
