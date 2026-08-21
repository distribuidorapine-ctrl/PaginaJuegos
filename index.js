const pantallaJuego = document.getElementById("pantallaJuego");
const tituloJuego = document.getElementById("tituloJuego");
const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

function iniciarJuego(juego) {

    document.querySelector(".juegos").style.display = "none";

    pantallaJuego.style.display = "block";

    if (juego === "plataformer") {
        tituloJuego.textContent = "🎮 Plataformer";
        iniciarPlataformer();
    }

    if (juego === "snake") {
        tituloJuego.textContent = "🐍 Snake";
        iniciarSnake();
    }
}

function volverMenu() {

    pantallaJuego.style.display = "none";

    document.querySelector(".juegos").style.display = "flex";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function proximamente() {
    alert("🚧 Este juego estará disponible próximamente.");
}


// ==========================
// PLATAFORMER BÁSICO
// ==========================

function iniciarPlataformer() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let jugador = {
        x: 100,
        y: 350,
        ancho: 40,
        alto: 40,
        velocidad: 5,
        salto: -12,
        velocidadY: 0,
        enSuelo: false
    };

    let teclas = {};

    document.onkeydown = function(e) {
        teclas[e.key] = true;
    };

    document.onkeyup = function(e) {
        teclas[e.key] = false;
    };

    let plataformas = [
        {
            x: 0,
            y: 450,
            ancho: 800,
            alto: 50
        },
        {
            x: 250,
            y: 350,
            ancho: 150,
            alto: 20
        },
        {
            x: 500,
            y: 280,
            ancho: 150,
            alto: 20
        }
    ];

    function actualizar() {

        if (teclas["ArrowLeft"]) {
            jugador.x -= jugador.velocidad;
        }

        if (teclas["ArrowRight"]) {
            jugador.x += jugador.velocidad;
        }

        if (teclas["ArrowUp"] && jugador.enSuelo) {
            jugador.velocidadY = jugador.salto;
            jugador.enSuelo = false;
        }

        jugador.velocidadY += 0.5;
        jugador.y += jugador.velocidadY;

        jugador.enSuelo = false;

        plataformas.forEach(plataforma => {

            if (
                jugador.x < plataforma.x + plataforma.ancho &&
                jugador.x + jugador.ancho > plataforma.x &&
                jugador.y + jugador.alto > plataforma.y &&
                jugador.y + jugador.alto < plataforma.y + plataforma.alto + 15 &&
                jugador.velocidadY >= 0
            ) {

                jugador.y = plataforma.y - jugador.alto;

                jugador.velocidadY = 0;

                jugador.enSuelo = true;
            }
        });

        if (jugador.x < 0) {
            jugador.x = 0;
        }

        if (jugador.x + jugador.ancho > canvas.width) {
            jugador.x = canvas.width - jugador.ancho;
        }

        if (jugador.y > canvas.height) {
            jugador.x = 100;
            jugador.y = 350;
            jugador.velocidadY = 0;
        }
    }

    function dibujar() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fondo
        ctx.fillStyle = "#151515";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Plataformas
        ctx.fillStyle = "#00ff88";

        plataformas.forEach(plataforma => {
            ctx.fillRect(
                plataforma.x,
                plataforma.y,
                plataforma.ancho,
                plataforma.alto
            );
        });

        // Jugador
        ctx.fillStyle = "#ff3333";

        ctx.fillRect(
            jugador.x,
            jugador.y,
            jugador.ancho,
            jugador.alto
        );
    }

    function juego() {

        actualizar();
        dibujar();

        requestAnimationFrame(juego);
    }

    juego();
}


// ==========================
// SNAKE BÁSICO
// ==========================

function iniciarSnake() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let snake = [
        {
            x: 400,
            y: 250
        }
    ];

    let comida = {
        x: 200,
        y: 200
    };

    let direccion = "derecha";

    document.onkeydown = function(e) {

        if (e.key === "ArrowUp" && direccion !== "abajo") {
            direccion = "arriba";
        }

        if (e.key === "ArrowDown" && direccion !== "arriba") {
            direccion = "abajo";
        }

        if (e.key === "ArrowLeft" && direccion !== "derecha") {
            direccion = "izquierda";
        }

        if (e.key === "ArrowRight" && direccion !== "izquierda") {
            direccion = "derecha";
        }
    };

    function juegoSnake() {

        let cabeza = {
            x: snake[0].x,
            y: snake[0].y
        };

        if (direccion === "arriba") {
            cabeza.y -= 20;
        }

        if (direccion === "abajo") {
            cabeza.y += 20;
        }

        if (direccion === "izquierda") {
            cabeza.x -= 20;
        }

        if (direccion === "derecha") {
            cabeza.x += 20;
        }

        snake.unshift(cabeza);

        if (
            cabeza.x === comida.x &&
            cabeza.y === comida.y
        ) {

            comida.x =
                Math.floor(Math.random() * 40) * 20;

            comida.y =
                Math.floor(Math.random() * 25) * 20;

        } else {

            snake.pop();
        }

        if (
            cabeza.x < 0 ||
            cabeza.x >= canvas.width ||
            cabeza.y < 0 ||
            cabeza.y >= canvas.height
        ) {

            snake = [
                {
                    x: 400,
                    y: 250
                }
            ];

            direccion = "derecha";
        }

        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Serpiente
        ctx.fillStyle = "#00ff88";

        snake.forEach(parte => {

            ctx.fillRect(
                parte.x,
                parte.y,
                18,
                18
            );
        });

        // Comida
        ctx.fillStyle = "#ff3333";

        ctx.fillRect(
            comida.x,
            comida.y,
            18,
            18
        );

        setTimeout(juegoSnake, 120);
    }

    juegoSnake();
}
