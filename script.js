const gridvalue = document.getElementById("gridsizeinput");
const rngsvalue = document.getElementById("rnginput");
const speedvalue = document.getElementById("speedinput");
const grid = document.getElementById("grid");

//control UI texts
const sizespan  = document.getElementById("sizespan");
const rngspan = document.getElementById("rngspan");
const speedspan = document.getElementById("speedspan");

//buttons
const rngbtn = document.getElementById("rngbtn");
const playandstopbtn = document.getElementById("playbtn");
const restartbtn = document.getElementById("restartbtn");


//global vars
let gamematriz;
let size;
let totalsize;
let rngsamount;
let speed;
let evolutiontimer;
let isplay;




function updateAll() {
    updateSize();
    updaterng();
    updateSpeed();
}



function updateMatrizsize() {
    
    gamematriz = [];

    for (let i = 0; i < size; i++) {
        
        gamematriz[i] = [];
        
    }

}


function updateGridui() {
    
    grid.style.gridTemplateRows = `repeat(${size},1fr)`;
    grid.style.gridTemplateColumns = `repeat(${size},1fr)`;

    const fragment = document.createDocumentFragment();
    
    grid.innerHTML = '';

    for (let i = 0; i < size; i++) {

        for (let j = 0; j < size; j++) {
            
            const cell = document.createElement('div');
            
            cell.className = 'cell';
            
            if (gamematriz[i][j]) {

                cell.classList.add('active');
            }

            cell.setAttribute("data-index", `${i},${j}`);

            cell.addEventListener("click", () => {
            
                if (isplay) {
                    return;
                }

                const active = cell.classList.toggle("active");
                
                gamematriz[i][j] = active;     
                
            });
            
            
            fragment.appendChild(cell);        
        }
    
    }
    grid.appendChild(fragment);

}



function updaterng() {
    
    rngsamount = parseInt(rngsvalue.value);
        
    rngspan.textContent = `${rngsamount}`;

    rngsvalue.setAttribute("max", (totalsize) * 0.60);

}


function updateSize() {
    
    changeplaybutton(true);
    stopanim();

    size = parseInt(gridvalue.value);
    
    totalsize = (size*size);
    
    sizespan.textContent = `${size} x ${size}`;

    updaterng();
    updateMatrizsize();
    updateGridui();
}


function updateSpeed() {
    
    speed = parseInt(speedvalue.value);
    
    speedspan.textContent = `${speed}ms`;

}


function randPosition() {
    
    return Math.floor(Math.random() * size);

}


function randomCells() {
    
    updateMatrizsize();

    let rng = rngsamount; 

    while (rng > 0) {
           
        let i = randPosition();
        let j = randPosition();

        if (gamematriz[i][j]) {
            continue;
        }
        
        gamematriz[i][j] = true;
        rng--;
        
    }

    updatefrommatriz();

}


function updatefrommatriz() {
    
    const children = grid.children;

    for (let i = 0; i < totalsize; i++) {
        
        const cell = children[i];
        
        const index = cell.getAttribute("data-index").split(",");
    
        let j = index[0];
        let k = index[1];

        
        if (gamematriz[j][k]) {
            
        
            cell.classList.add("active");
        
        }
        else{
        
            cell.classList.remove("active");
        
        }
        
        
    }


}



//Logic

function getNeighbors(x, y) {
    
    let cont = 0;

    for (let i = -1; i <= 1; i++) {
        
        for (let j = -1; j <= 1; j++) {
            
            let posx = x + i; 
            let posy = y + j; 
            
            if (posx < 0 || posy < 0 || posx >= size || posy >= size || posx == x && posy == y) 
            {
                continue; 
            }
                        
            if (gamematriz[posx][posy]) {
                cont++;
            }
            
        }
        
    }
    
    return cont;

}

function getVitality(x, y) {
    
    let neighbors = getNeighbors(x, y);

    if (gamematriz[x][y]) {
        
        return neighbors >= 2 && neighbors <= 3;

    }

    return neighbors === 3;

}


function evolve() {
    
    let matriz = [];

    for (let i = 0; i < size; i++) {
        
        matriz[i] = [];
        
    }

    for (let i = 0; i < size; i++) {

        for (let j = 0; j < size; j++) {

            matriz[i][j] = getVitality(i,j);

        }

    }
    
    gamematriz = matriz;

    updatefrommatriz();

}


function clear() {

    for (let i = 0; i < size; i++) {

        for (let j = 0; j < size; j++) {

            gamematriz[i][j] = false;

        }

    }
    
    updatefrommatriz();
}


function playanim() {

    isplay = true;
    evolutiontimer = setInterval(evolve, speed);

}

function stopanim() {

    isplay = false;
    clearInterval(evolutiontimer);

}


function updatespeed() {
    
    speed = parseInt(speedvalue.value);
    speedspan.textContent = `${speed}ms`;
    
    if (!isplay) {
        return;
    }
    
    stopanim();    
    playanim();
}




function changeplaybutton(restart) {
    
    if (restart) {
    
        playandstopbtn.classList.remove('stopbtn');
        playandstopbtn.textContent = "▶ Play";
        return;
    }
    
    isplay = !playandstopbtn.classList.contains('stopbtn');
    
    playandstopbtn.textContent = (isplay) ? "⏸ Stop" : "▶ Play";

    playandstopbtn.classList.toggle('stopbtn');
    
    return isplay;
}


gridvalue.addEventListener("input",updateSize);
rngsvalue.addEventListener("input",updaterng);
speedvalue.addEventListener("input",updatespeed);


rngbtn.addEventListener("click", randomCells);

restartbtn.addEventListener("click", () => {

    changeplaybutton(true);
    clear();
    stopanim();

});

playandstopbtn.addEventListener("click", () => {

    
    if (changeplaybutton(false)) {
        evolve();
        playanim();
    }
    else{

        stopanim();

    }

});

function setbtnAnimation() {
    
    let btns = document.querySelectorAll(".controlbtn");

    btns.forEach((e) => {

        e.addEventListener('mousedown', () => {

            e.classList.add("pressed");
            
        })  

        e.addEventListener('mouseup', () => {

            e.classList.remove("pressed");
            
        })  

    })

}





setbtnAnimation();
updateAll();






