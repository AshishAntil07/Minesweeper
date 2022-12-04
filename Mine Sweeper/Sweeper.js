class Elems{
  constructor(){}
  flag(){
    const flag = document.createElement('div');
    flag.setAttribute('style', `
      height: 75%;
      width: 75%;
      background: url('Pictures/Flag.svg') no-repeat;
      background-size: contain;
    `)
    return flag;
  }
  game(state, main){
    const container = document.createElement('div');
    container.setAttribute('style', `
      height: 175px;
      width: 300px;
      position: absolute;
      left: ${(window.innerWidth+Number(getComputedStyle(sideBar).width.replace('px', '')))/2}px;
      top: 50%;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      background: rgb(139, 0, 0, .6);
      border: 1px solid yellow;
      border-radius: 10px;
      z-index: 100;
      color: white;
      transform: translate(-50%, -50%);
    `)

    const top = document.createElement('div');
    top.setAttribute('style', `
      padding: 5px;
      display: flex;
      width: 100%;
    `)

    const heading = document.createElement('div');
    heading.innerHTML = state==='over'?'Game Over':'Victory!';
    heading.setAttribute('style', `
      text-align: center;
      font-family: 'cascadia code', consolas;
      font-size: 25px;
      width: 100%;
    `)

    const cross = document.createElement('div');
    cross.setAttribute('style', `
      height: 25px;
      width: 25px;
      cursor: pointer;
    `)
    cross.innerHTML = '&Cross;';
    cross.addEventListener('click', e => {
      main.remove();
      Start();
    })
    top.append(heading, cross);

    const times = document.createElement('div');
    times.setAttribute('style', `
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    `)

    if((!localStorage.getItem('Minesweeper') || Number(yourTime.children[1].innerHTML)<JSON.parse(localStorage.getItem('Minesweeper')).best) && state!=='over'){
      bestTime.children[1].innerHTML = yourTime.children[1].innerHTML;
      localStorage.setItem('Minesweeper', JSON.stringify({best: Number(bestTime.children[1].innerHTML)}))
    }

    const best = document.createElement('div');
    best.innerHTML = `<embed src='Pictures/Clock.svg?color=e0bf00' height='75px' width='75px'><span desc style='color: #e0bf00'>Best Time</span>${JSON.parse(localStorage.getItem('Minesweeper'))?.best || 0}s`;
    best.setAttribute('style', `
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column nowrap;
      font-size: 20px;
      font-weight: 500;
    `)

    const current = document.createElement('div');
    current.innerHTML = `<embed src='Pictures/Clock.svg?color=ff0000' height='75px' width='75px'><span desc style='color: #ff0000'>Your Time</span>${yourTime.children[1].innerHTML}s`;
    current.setAttribute('style', `
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column nowrap;
      font-size: 20px;
      font-weight: 500;
    `)
    times.append(current, best);

    yourTime.children[1].innerHTML = 0;
    container.append(top, times);
    return container;
  }
}

const sideBar = document.createElement('div');
sideBar.classList.add('sideBar');

const header = document.createElement('div');
header.setAttribute('style', `
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 25px;
`);
header.innerHTML = '<img src="Pictures/Logo.svg" height="50px" width="50px" alt="M">inesweeper';

const info = document.createElement('div');
info.classList.add('info');

const flags = document.createElement('div');
flags.innerHTML = '<img src="Pictures/Flag.svg" height="35px" width="35px" alt="Flags">';
flags.setAttribute('style', `
  display: flex;
  justify-content: center;
  align-items: center;
`)

const flagCount = document.createElement('span');
flagCount.setAttribute('style', `
  font-family: 'cascadia code', consolas;
  font-weight: 500;
  font-size: 20px;
  margin-left: 5px;
`)
flags.append(flagCount);

const bestTime = document.createElement('div');
bestTime.innerHTML = `<embed src='Pictures/Clock.svg?color=e0bf00' height='45px' width='45px' style='margin-right: 10px;'><span>${JSON.parse(localStorage.getItem('Minesweeper'))?.best || 0}</span>s`;
bestTime.setAttribute('style', `
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
`)

const yourTime = document.createElement('div');
yourTime.innerHTML = `<embed src='Pictures/Clock.svg?color=ff0000' height='45px' width='45px' style='margin-right: 10px;'><span>0</span>s`;
yourTime.setAttribute('style', `
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
`)

info.append(flags, bestTime, yourTime);
sideBar.append(header, info);

let timeInterval;
function startTimer(){
  let seconds=0;
  timeInterval = setInterval(() => {
    yourTime.children[1].innerHTML = ++seconds;
  }, 1000)
}

function Start() {
  const game = document.createElement('div');
  game.classList.add('game');

  const main = document.createElement('table');
  main.classList.add('main');

  const cellColors = ['rgb(60, 255, 60)', 'rgb(60, 190, 60)'];

  const getByCoordinate = (x, y) => {
    let blanket=[];
    cells.cells.forEach((elem, index) => {
      !(index%10)?blanket.push([]):0;
      blanket[blanket.length-1].push(elem);
    })
    return blanket[x]?blanket[x][y]:false;
  }

  let cells={cells: [], opened: 0, unsafeCells: [], unsafe: 0};
  for(let i=j=0; i<100; i++, j++){
    const cell = document.createElement('td');
    cell.classList.add('cell');

    cell.style.background = cellColors[(i%10===0&&i?j++-1:j)%2];
    (j-2)%2!==0?cell.dark=true:cell.dark=false;

    if(i%10===0){
      main.append(document.createElement('tr'));
    }
    cell.coordinate = {
      x: main.children.length-1,
      y: Number(String(i).slice(-1, String(i).length))
    };

    cell.aroundBombs = () => {
      let bombs=0;
      const neighbours = [
        {x: cell.coordinate.x-1, y: cell.coordinate.y-1},
        {x: cell.coordinate.x-1, y: cell.coordinate.y},
        {x: cell.coordinate.x-1, y: cell.coordinate.y+1},
        {x: cell.coordinate.x, y: cell.coordinate.y-1},
        {x: cell.coordinate.x, y: cell.coordinate.y+1},
        {x: cell.coordinate.x+1, y: cell.coordinate.y-1},
        {x: cell.coordinate.x+1, y: cell.coordinate.y},
        {x: cell.coordinate.x+1, y: cell.coordinate.y+1}
      ]
      neighbours.forEach(coordinate => {
        const neighbourCell = getByCoordinate(coordinate.x, coordinate.y);
        if(neighbourCell?.unsafe) bombs++;
      });
      return [bombs, neighbours];
    }

    const countOpened = e => {
      let opened = 0;
      cells.cells.forEach(cell => cell.opened?opened++:0);
      return opened;
    }

    const clickFunc = e => {
      if(!cell.flagged){
        cell.style.background = cell.dark?'rgb(190, 190, 0)':'yellow';
        cell.opened=true;
        if(cell.unsafe){
          e.stopImmediatePropagation();
          clearInterval(timeInterval);
          const openUnsafe = cell => {
            cell.style.color = 'red';
            cell.innerHTML = '&Cross;';
            cell.style.background = cell.dark?'rgb(190, 190, 0)':'yellow';
            cell.style.fontSize = '20px';
          }
          const container = new Elems().game('over', game);
          cells.unsafeCells.forEach(openUnsafe);
          cells.cells.forEach(cell => cell.removeEventListener('click', cell.listener));
          game.prepend(container);
        }else{
          cells.opened = countOpened();
          const [aroundBombs, neighbours] = cell.aroundBombs();
          if(aroundBombs){
            cell.innerHTML = aroundBombs;
            const colors = ['blue', 'darkgreen', 'orangered', 'maroon', 'purple', 'black']
            cell.style.color = colors[aroundBombs-1];
          }else{
            neighbours.forEach(neighbour => {
              const neighbourCell = getByCoordinate(neighbour.x, neighbour.y);
              if(neighbourCell) neighbourCell.click();
            });
          }
          if(!(cells.cells.length-cells.opened-cells.unsafe)){
            clearInterval(timeInterval);
            const container = new Elems().game('won', game);
            game.prepend(container);
            cells.cells.forEach(cell => cell.removeEventListener('click', cell.listener));
          }
        }
        cell.removeEventListener('click', clickFunc)
      }
    }

    cell.addEventListener('click', clickFunc)
    main.addEventListener('click', startTimer, {once:true});
    cell.listener = clickFunc;
    cell.addEventListener('contextmenu', e => {
      e.preventDefault();
      if(!cell.opened){
        if(!cell.flagged){
          const flag = new Elems().flag();
          cell.append(flag);
          cell.flag = flag;
          flagCount.innerHTML = Number(flagCount.innerHTML)-1;
          cell.flagged=true;
        }else{
          cell.flag.remove();
          flagCount.innerHTML = Number(flagCount.innerHTML)+1
          cell.flagged=false;
        }
      }
    });

    cells.cells.push(cell);
    main.lastElementChild.append(cell);
  }

  let cellDummy = [...cells.cells];
  for(let k=0; k<20; k++){
    const index = parseInt(Math.random()*cellDummy.length-1);
    const cell = cellDummy[index];
    cell.unsafe = true;
    cellDummy.splice(index, 1);
  }
  cells.cells.forEach(cell=>{if(cell.unsafe){cells.unsafe++;cells.unsafeCells.push(cell)}});
  flagCount.innerHTML = cells.unsafe;
  // cells.cells.forEach(cell=>!cell.unsafe?cell.click():0)


  game.append(main);
  document.body.append(game);
}
document.body.append(sideBar);
Start();