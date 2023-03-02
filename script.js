window.onload = function () {
    // Seleccionar el contenedor del tablero de juego
    const playBoard = document.querySelector('.play-board');
    const scoreElement = document.querySelector('.score');
    const highScoreElement = document.querySelector('.high-score');
    const controls = document.querySelectorAll(".controls i")

    // Inicializar variables
    let gameOver = false;
    let foodX, foodY;
    let snakeX = 5, snakeY = 10;
    let snakeBody = [];
    let velocityX = 0, velocityY = 0;
    let setIntervalId;
    let score = 0;
    let highScore = localStorage.getItem("high-score") || 0; //obtiene la puntuacion maxima de localstorage
    highScoreElement.innerText = `High Score: ${highScore}`;

    // Función para generar la posición aleatoria de la comida
    const RandomFoodPosition = () => {
        // Generar una posición aleatoria para la comida en el contenedor
        foodX = Math.floor(Math.random() * 30) + 1;
        foodY = Math.floor(Math.random() * 30) + 1;
    }

    // arrow funcion para parar el juego
    const TheGameIsOver = () => {
        clearInterval(setIntervalId); //limpia el tiempo
        alert("The Game is Over, press OK to replay...");
        location.reload(); //reinicia la pagina cuando presionamos ok
    }
    // Función para inicializar el juego y actualizar el tablero
    const initGame = () => {

        let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`; // Generar el HTML para la comida
        //playBoard.innerHTML = htmlMarkup; // Agregar la comida al tablero

        // Actualizar la posición de la cabeza de la serpiente según la velocidad actual
        snakeX += velocityX;
        snakeY += velocityY;

        // Chequear si la serpiente choca con la pared
        if (snakeX <= 0 || snakeY <= 0 || snakeX > 30 || snakeY > 30) {
            gameOver = true;
        }

        //si la variable gameOver es true, ejecuta la funcion TheGameIsOver();
        if (gameOver) return TheGameIsOver();

        // Chequear si la serpiente choca con la comida
        if (snakeX === foodX && snakeY === foodY) {
            RandomFoodPosition(); // Generar una nueva posición aleatoria para la comida
            snakeBody.push([foodX, foodY]); // Agregar la comida a la serpiente
            score++; //incrementa el score en 1 evidentemente
            highScore = score >= highScore ? score : highScore; //obtienes un highscore si el score es mayor o igual al highScore
            localStorage.setItem("high-score", highScore); //guardamos el valor de high score en local storage con la clase high score del DOM
            scoreElement.innerText = `Score: ${score}`; // imprime la variable score en el DOM
            highScoreElement.innerText = `High Score: ${highScore}`; // imprime la variable highScore en el DOM
        }

        for (let i = snakeBody.length - 1; i > 0; i--) {
            snakeBody[i] = snakeBody[i - 1]; //cambia los valores de los elementos al frente del cuerpo de la serpiente
        }

        snakeBody[0] = [snakeX, snakeY]; // Actualizar la posición de la cabeza de la serpiente en el array de partes del cuerpo

        // Actualizar el HTML para cada parte del cuerpo de la serpiente
        for (let i = 0; i < snakeBody.length; i++) {
            htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`; // Generar el HTML para la parte del cuerpo
            //chequear si la serpiente choca con su body
            if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
                gameOver = true;
            }
        }
        playBoard.innerHTML = htmlMarkup; // Agregar la comida al tablero
    }

    // Función para cambiar la dirección de la serpiente según la tecla presionada
    const changeDirection = (e) => {
        if (e.key === "ArrowUp" && velocityY != 1) {
            velocityX = 0;
            velocityY = -1;
        } else if (e.key === "ArrowDown" && velocityY != -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (e.key === "ArrowLeft" && velocityX != 1) {
            velocityX = -1;
            velocityY = 0;
        } else if (e.key === "ArrowRight" && velocityX != -1) {
            velocityX = 1;
            velocityY = 0;
        }
    }
    
    controls.forEach(key => {
        key.addEventListener("click", () => changeDirection({key: key.dataset.key})); //llama la funcion changeDirection al escuchar un click en cada uno
    });

    // Generar una posición aleatoria para la comida y actualizar el tablero cada 100ms
    RandomFoodPosition();
    setIntervalId = setInterval(initGame, 100);

    // Escuchar los eventos del teclado para cambiar la dirección de la serpiente
    document.addEventListener("keydown", changeDirection);
}
