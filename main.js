var twoPlayers = null;
if(JSON.parse(localStorage.getItem("twoPlayers"))==null){ //if it doesn't exist yet, initialize it to false
    twoPlayers = false; 
    localStorage.setItem("twoPlayers", JSON.stringify(twoPlayers));
}
else{
    twoPlayers = JSON.parse(localStorage.getItem("twoPlayers"));
}

localStorage.setItem("twoPlayers", JSON.stringify(twoPlayers));

function toggleTwoPlayerMode(event){
    if (JSON.parse(localStorage.getItem("twoPlayers"))==false){
        event.innerHTML = "Two Player Mode: <br> On! (Refresh)";
        twoPlayers = true;
        localStorage.setItem("twoPlayers", JSON.stringify(twoPlayers));
    }
    else if (JSON.parse(localStorage.getItem("twoPlayers"))==true){
        event.innerHTML = "Two Player Mode: <br> Off! (Refresh)";
        twoPlayers = false;
        localStorage.setItem("twoPlayers", JSON.stringify(twoPlayers));
    }
    else{
        event.innerHTML = "error";
    }
}


const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const carCtx = carCanvas.getContext("2d");
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;
const numTrafficObstacles = 10;
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
//breaks when no car in leftmost and car in middle lane at the very beginning
const traffic = [];
for(let i = 1; i<numTrafficObstacles*2; i+=2){ 
    car = new Car(road.getLaneCenter(getRandomInt(0,2)), -(i*100), 30, 50, "DUMMY");
    car1 = new Car(road.getLaneCenter(getRandomInt(0,2)), -(i*100), 30, 50, "DUMMY");
    traffic.push(car);
    traffic.push(car1);
};

const playerCanvas=document.getElementById("playerCanvas");
playerCanvas.width=200;
const playerCtx = playerCanvas.getContext("2d");
const playerRoad = new Road(playerCanvas.width/2, playerCanvas.width*0.9);
const playerCar = new Car(playerRoad.getLaneCenter(1), 100, 30, 50, "KEYS");
const gameTraffic = [];
for(let i = 1; i<numTrafficObstacles*2; i+=2){ 
    car2 = new Car(playerRoad.getLaneCenter(getRandomInt(0,2)), -(i*100), 30, 50, "DUMMY");
    car3 = new Car(playerRoad.getLaneCenter(getRandomInt(0,2)), -(i*100), 30, 50, "DUMMY");
    gameTraffic.push(car2);
    gameTraffic.push(car3);
};

const player2Canvas=document.getElementById("player2Canvas");
twoPlayers?player2Canvas.width=200:player2Canvas.width=0;
const player2Ctx = player2Canvas.getContext("2d");
const player2Road = new Road(player2Canvas.width/2, player2Canvas.width*0.9);
const player2Car = new Car(player2Road.getLaneCenter(1), 100, 30, 50, "WASD");
const player2traffic = [];
for(let i = 1; i<numTrafficObstacles*2; i+=2){ 
car2 = new Car(player2Road.getLaneCenter(getRandomInt(0,2)), -(i*100), 30, 50, "DUMMY");
car3 = new Car(player2Road.getLaneCenter(getRandomInt(0,2)), -(i*100), 30, 50, "DUMMY");
player2traffic.push(car2);
player2traffic.push(car3);
};

const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];

if(localStorage.getItem("bestBrain")){
    for(let i = 0; i<cars.length;i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));

        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, 0.15);
        }
    }
}
else{
    for(let i = 0; i<cars.length;i++){
        fetch('bestBrain.json')
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            cars[i].brain = data; // Assign the parsed data to the brain property
            })
    .catch(error => console.error('Error loading brain data:', error));
    }
}

// // Function to trigger download of JSON data
// function downloadJSON() {
//     // Generate data URI for the JSON data
//     var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(JSON.parse(
//         localStorage.getItem("bestBrain"))));
    
//     // Create a hidden anchor element dynamically
//     var dlAnchorElem = document.createElement('a');
//     dlAnchorElem.setAttribute("href", dataStr);
//     dlAnchorElem.setAttribute("download", "scene.json");

//     // Append the anchor element to the document body
//     document.body.appendChild(dlAnchorElem);

//     // Click on the anchor element to trigger download
//     dlAnchorElem.click();

//     // Remove the anchor element from the document body
//     document.body.removeChild(dlAnchorElem);
// }

// // Call the function to trigger the download
// downloadJSON();

animate();
animatePlayer();
if(twoPlayers){
    animatePlayer2();
}

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function refresh(){
    location.reload();
}

function generateCars(N){
    const cars = [];
    for(let i = 1; i<=N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function isGameOver(){
    networkCtx.fillStyle = 'white'; 
    networkCtx.font = '30px Arial';
    if (!twoPlayers){
        if(bestCar.damaged!=true && playerCar.damaged!=true){
            if (playerCar.y < gameTraffic[gameTraffic.length-1].y-50){
                return 'YOU WON!';
            }
            else if (bestCar.y < traffic[traffic.length-1].y-50){
                return 'YOU LOSE!';
            }
            else{
                return null;
            }
        }
        else if(bestCar.damaged!=true && playerCar.damaged==true){
            return 'YOU LOSE!';
        }
        else if (bestCar.damaged==true && playerCar.damaged!=true){
            return 'YOU WON!';
        }
        else{
            return 'edge case';
        } 
    }
    else{
        if(bestCar.damaged!=true && playerCar.damaged!=true&&player2Car.damaged!=true){
            if (playerCar.y < gameTraffic[gameTraffic.length-1].y-50){
                return 'PLAYER 1 WINS!';
            }
            else if (bestCar.y < traffic[traffic.length-1].y-50){
                return 'COMPUTER WINS!';
            }
            else if (player2Car.y < player2traffic[player2traffic.length-1].y-50){
                return 'PLAYER 2 WINS!';
            }
            else{
                return null;
            }
        }

        //we want one player to continue playing until a player or computer has won even if one player has crashed
        else if(bestCar.damaged!=true && (playerCar.damaged==true&&player2Car.damaged==true)){
            return 'COMPUTER WINS!';
        }
        else if(bestCar.damaged!=true && (playerCar.damaged!=true&&player2Car.damaged==true)){
            if (playerCar.y < gameTraffic[gameTraffic.length-1].y-50){
                return 'PLAYER 1 WINS!';
            }
            else if (bestCar.y < traffic[traffic.length-1].y-50){
                return 'COMPUTER WINS!';
            }
        }
        else if(bestCar.damaged!=true && (playerCar.damaged==true&&player2Car.damaged!=true)){
            if (player2Car.y < player2traffic[player2traffic.length-1].y-50){
                return 'PLAYER 2 WINS!';
            }
            else if (bestCar.y < traffic[traffic.length-1].y-50){
                return 'COMPUTER WINS!';
            }
        }
        //we also want the players to continue on their own if the computer crashes
        else if (bestCar.damaged==true){
            if (playerCar.damaged==true && player2Car.damaged!=true){
                return 'PLAYER 2 WINS!';
            }
            else if (playerCar.damaged!=true && player2Car.damaged!=true){
                if (player2Car.y < player2traffic[player2traffic.length-1].y-50){
                    return 'PLAYER 2 WINS!';
                }
                else if(playerCar.y < gameTraffic[gameTraffic.length-1].y-50){
                    return 'PLAYER 1 WINS!';
                }
                else{
                    return null;
                }
            }
            else if (playerCar.damaged!=true && player2Car.damaged==true){
                return 'PLAYER 1 WINS!';
            }
            else{
                return 'edge case';
            }
        }
        else{
            return null;
        } 
    }
}

function animatePlayer(){
    playerCanvas.height=window.innerHeight;

    for(let i =0; i<gameTraffic.length;i++){
        gameTraffic[i].update(playerRoad.borders,[]);
    }

    playerCtx.save();
    playerCtx.translate(0,-playerCar.y+playerCanvas.height*0.7);  //HAVE TO CHANGE BEST CAR IN HERE TO PLAYER'S CAR

    playerRoad.draw(playerCtx);
    for(let i =0; i<gameTraffic.length;i++){
        gameTraffic[i].draw(playerCtx, "yellow");
    }

    playerCar.update(playerRoad.borders, gameTraffic);
    playerCar.draw(playerCtx, "white");

    playerCtx.restore();
    if (isGameOver()==null){
        requestAnimationFrame(animatePlayer);
    }
    else{
        networkCtx.fillText(isGameOver(), 150, 100); 
    }
}

function animatePlayer2(){
    player2Canvas.height=window.innerHeight;

    for(let i =0; i<player2traffic.length;i++){
        player2traffic[i].update(player2Road.borders,[]);
    }

    player2Ctx.save();
    player2Ctx.translate(0,-player2Car.y+player2Canvas.height*0.7);  //HAVE TO CHANGE BEST CAR IN HERE TO PLAYER'S CAR

    player2Road.draw(player2Ctx);
    for(let i =0; i<player2traffic.length;i++){
        player2traffic[i].draw(player2Ctx, "yellow");
    }

    player2Car.update(player2Road.borders, player2traffic);
    player2Car.draw(player2Ctx, "white");

    player2Ctx.restore();
    if (isGameOver()==null){
        requestAnimationFrame(animatePlayer2);
    }
    else{
        networkCtx.fillText(isGameOver(), 150, 100); 
    }
}

function animate(time){
    for(let i =0; i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for (let i = 0; i<cars.length;i++){
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i =0; i<traffic.length;i++){
        traffic[i].draw(carCtx, "yellow");
    }

    carCtx.globalAlpha=0.2;
    for (let i = 0; i<cars.length;i++){
        cars[i].draw(carCtx, "white");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "white", true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);

    //requestAnimationFrame(animateSet2);
    if (isGameOver()==null){
        requestAnimationFrame(animate);
    }
    else{
        networkCtx.fillText(isGameOver(), 150, 100); 
    }
}