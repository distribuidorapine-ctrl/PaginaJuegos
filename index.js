const pantallaJuego =
    document.getElementById("pantallaJuego");

const tituloJuego =
    document.getElementById("tituloJuego");

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


let juegoActual = null;

let animacion = null;

let intervalo = null;


// =====================================
// ABRIR JUEGO
// =====================================

function iniciarJuego(juego) {

    detenerJuego();

    document.querySelector(".juegos").style.display =
        "none";

    pantallaJuego.style.display =
        "block";

    juegoActual = juego;


    if (juego === "plataformer") {

        tituloJuego.textContent =
            "🎮 Plataformer";

        iniciarPlataformer();
    }


    if (juego === "snake") {

        tituloJuego.textContent =
            "🐍 Snake";

        iniciarSnake();
    }


    if (juego === "shooter") {

        tituloJuego.textContent =
            "🚀 Space Shooter";

        iniciarShooter();
    }
}


// =====================================
// VOLVER AL MENÚ
// =====================================

function volverMenu() {

    detenerJuego();

    pantallaJuego.style.display =
        "none";

    document.querySelector(".juegos").style.display =
        "flex";

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


// =====================================
// DETENER JUEGO
// =====================================

function detenerJuego() {

    if (animacion !== null) {

        cancelAnimationFrame(animacion);

        animacion = null;
    }


    if (intervalo !== null) {

        clearInterval(intervalo);

        clearTimeout(intervalo);

        intervalo = null;
    }


    document.onkeydown = null;

    document.onkeyup = null;
}


// =====================================
// JUEGO 1
// PLATAFORMER
// =====================================

function iniciarPlataformer() {

    let jugador = {

        x: 100,
        y: 350,

        ancho: 40,
        alto: 40,

        velocidad: 5,

        velocidadY: 0,

        salto: -12,

        enSuelo: false
    };


    let teclas = {};


    document.onkeydown = function(e) {

        teclas[e.key] = true;

        if (e.key === " ") {
            e.preventDefault();
        }
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
            x: 200,
            y: 360,
            ancho: 150,
            alto: 20
        },

        {
            x: 450,
            y: 300,
            ancho: 150,
            alto: 20
        },

        {
            x: 650,
            y: 220,
            ancho: 120,
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


        if (
            (teclas["ArrowUp"] ||
            teclas[" "]) &&
            jugador.enSuelo
        ) {

            jugador.velocidadY =
                jugador.salto;

            jugador.enSuelo = false;
        }


        jugador.velocidadY += 0.5;

        jugador.y +=
            jugador.velocidadY;


        jugador.enSuelo = false;


        plataformas.forEach(p => {

            if (

                jugador.x <
                p.x + p.ancho &&

                jugador.x +
                jugador.ancho >
                p.x &&

                jugador.y +
                jugador.alto >
                p.y &&

                jugador.y +
                jugador.alto <
                p.y + p.alto + 20 &&

                jugador.velocidadY >= 0

            ) {

                jugador.y =
                    p.y -
                    jugador.alto;

                jugador.velocidadY = 0;

                jugador.enSuelo = true;
            }
        });


        if (jugador.x < 0) {

            jugador.x = 0;
        }


        if (
            jugador.x +
            jugador.ancho >
            canvas.width
        ) {

            jugador.x =
                canvas.width -
                jugador.ancho;
        }


        if (
            jugador.y >
            canvas.height
        ) {

            jugador.x = 100;

            jugador.y = 350;

            jugador.velocidadY = 0;
        }
    }


    function dibujar() {

        ctx.fillStyle = "#151515";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "#00ff88";


        plataformas.forEach(p => {

            ctx.fillRect(
                p.x,
                p.y,
                p.ancho,
                p.alto
            );
        });


        ctx.fillStyle = "#ff3333";

        ctx.fillRect(
            jugador.x,
            jugador.y,
            jugador.ancho,
            jugador.alto
        );


        ctx.fillStyle = "white";

        ctx.font = "18px Arial";

        ctx.fillText(
            "← → Mover | ↑ Saltar",
            20,
            30
        );
    }


    function juego() {

        if (juegoActual !== "plataformer") {
            return;
        }

        actualizar();

        dibujar();

        animacion =
            requestAnimationFrame(juego);
    }


    juego();
}


// =====================================
// JUEGO 2
// SNAKE
// =====================================

function iniciarSnake() {

    let snake = [

        {
            x: 400,
            y: 240
        }
    ];


    let comida = {

        x: 200,
        y: 200
    };


    let direccion =
        "derecha";


    let puntos = 0;


    document.onkeydown = function(e) {

        if (
            e.key === "ArrowUp" &&
            direccion !== "abajo"
        ) {

            direccion = "arriba";
        }


        if (
            e.key === "ArrowDown" &&
            direccion !== "arriba"
        ) {

            direccion = "abajo";
        }


        if (
            e.key === "ArrowLeft" &&
            direccion !== "derecha"
        ) {

            direccion = "izquierda";
        }


        if (
            e.key === "ArrowRight" &&
            direccion !== "izquierda"
        ) {

            direccion = "derecha";
        }
    };


    function juegoSnake() {

        if (juegoActual !== "snake") {
            return;
        }


        let cabeza = {

            x: snake[0].x,
            y: snake[0].y
        };


        if (direccion === "arriba")
            cabeza.y -= 20;

        if (direccion === "abajo")
            cabeza.y += 20;

        if (direccion === "izquierda")
            cabeza.x -= 20;

        if (direccion === "derecha")
            cabeza.x += 20;


        snake.unshift(cabeza);


        if (
            cabeza.x === comida.x &&
            cabeza.y === comida.y
        ) {

            puntos++;


            comida.x =
                Math.floor(
                    Math.random() * 40
                ) * 20;


            comida.y =
                Math.floor(
                    Math.random() * 25
                ) * 20;

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
                    y: 240
                }
            ];

            direccion = "derecha";

            puntos = 0;
        }


        ctx.fillStyle = "#111";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "#00ff88";


        snake.forEach(parte => {

            ctx.fillRect(
                parte.x,
                parte.y,
                18,
                18
            );
        });


        ctx.fillStyle =
            "#ff3333";


        ctx.fillRect(
            comida.x,
            comida.y,
            18,
            18
        );


        ctx.fillStyle =
            "white";

        ctx.font =
            "20px Arial";


        ctx.fillText(
            "Puntos: " + puntos,
            20,
            30
        );


        intervalo =
            setTimeout(
                juegoSnake,
                120
            );
    }


    juegoSnake();
}


// =====================================
// JUEGO 3
// SPACE SHOOTER
// =====================================

function iniciarShooter() {

    let nave = {

        x: 380,
        y: 430,

        ancho: 40,
        alto: 40,

        velocidad: 6
    };


    let teclas = {};

    let balas = [];

    let enemigos = [];

    let puntos = 0;


    document.onkeydown = function(e) {

        teclas[e.key] = true;


        if (e.key === " ") {

            balas.push({

                x:
                    nave.x +
                    17,

                y:
                    nave.y,

                ancho: 6,

                alto: 15,

                velocidad: 8
            });


            e.preventDefault();
        }
    };


    document.onkeyup = function(e) {

        teclas[e.key] = false;
    };


    intervalo = setInterval(function() {

        if (juegoActual !== "shooter") {
            return;
        }


        enemigos.push({

            x:
                Math.random() *
                760,

            y: -40,

            ancho: 40,

            alto: 40,

            velocidad:
                2 +
                Math.random() * 2
        });

    }, 700);


    function actualizar() {

        if (teclas["ArrowLeft"]) {

            nave.x -=
                nave.velocidad;
        }


        if (teclas["ArrowRight"]) {

            nave.x +=
                nave.velocidad;
        }


        if (nave.x < 0) {

            nave.x = 0;
        }


        if (
            nave.x +
            nave.ancho >
            canvas.width
        ) {

            nave.x =
                canvas.width -
                nave.ancho;
        }


        balas.forEach(bala => {

            bala.y -=
                bala.velocidad;
        });


        balas =
            balas.filter(
                bala =>
                    bala.y > -20
            );


        enemigos.forEach(enemigo => {

            enemigo.y +=
                enemigo.velocidad;
        });


        for (
            let i = balas.length - 1;
            i >= 0;
            i--
        ) {

            for (
                let j = enemigos.length - 1;
                j >= 0;
                j--
            ) {

                let bala = balas[i];

                let enemigo =
                    enemigos[j];


                if (

                    bala.x <
                    enemigo.x +
                    enemigo.ancho &&

                    bala.x +
                    bala.ancho >
                    enemigo.x &&

                    bala.y <
                    enemigo.y +
                    enemigo.alto &&

                    bala.y +
                    bala.alto >
                    enemigo.y

                ) {

                    balas.splice(i, 1);

                    enemigos.splice(j, 1);

                    puntos++;

                    break;
                }
            }
        }


        enemigos =
            enemigos.filter(
                enemigo =>
                    enemigo.y <
                    canvas.height + 50
            );
    }


    function dibujar() {

        ctx.fillStyle =
            "#05051a";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Estrellas

        ctx.fillStyle =
            "white";


        for (
            let i = 0;
            i < 50;
            i++
        ) {

            let x =
                (i * 137) %
                canvas.width;

            let y =
                (i * 83) %
                canvas.height;


            ctx.fillRect(
                x,
                y,
                2,
                2
            );
        }


        // Nave

        ctx.fillStyle =
            "#00ff88";


        ctx.fillRect(

            nave.x,
            nave.y,
            nave.ancho,
            nave.alto
        );


        // Balas

        ctx.fillStyle =
            "#ffff00";


        balas.forEach(bala => {

            ctx.fillRect(

                bala.x,
                bala.y,
                bala.ancho,
                bala.alto
            );
        });


        // Enemigos

        ctx.fillStyle =
            "#ff3333";


        enemigos.forEach(enemigo => {

            ctx.fillRect(

                enemigo.x,
                enemigo.y,
                enemigo.ancho,
                enemigo.alto
            );
        });


        // Puntos

        ctx.fillStyle =
            "white";

        ctx.font =
            "20px Arial";


        ctx.fillText(
            "Puntos: " + puntos,
            20,
            30
        );


        ctx.font =
            "16px Arial";


        ctx.fillText(
            "← → Mover | ESPACIO Disparar",
            20,
            55
        );
    }


    function juego() {

        if (juegoActual !== "shooter") {
            return;
        }


        actualizar();

        dibujar();


        animacion =
            requestAnimationFrame(juego);
    }


    juego();
}
