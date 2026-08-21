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

let intervalos = [];


// ==========================================
// SISTEMA GENERAL
// ==========================================

function iniciarJuego(juego) {

    detenerJuego();

    document.querySelector(".juegos").style.display =
        "none";

    pantallaJuego.style.display =
        "block";

    juegoActual = juego;


    if (juego === "plataformer") {

        tituloJuego.textContent =
            "🎮 PLATAFORMER";

        iniciarPlataformer();
    }


    if (juego === "snake") {

        tituloJuego.textContent =
            "🐍 SNAKE";

        iniciarSnake();
    }


    if (juego === "shooter") {

        tituloJuego.textContent =
            "🚀 SPACE SHOOTER";

        iniciarShooter();
    }
}


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


function detenerJuego() {

    juegoActual = null;


    if (animacion !== null) {

        cancelAnimationFrame(
            animacion
        );

        animacion = null;
    }


    intervalos.forEach(i => {

        clearInterval(i);

        clearTimeout(i);

    });


    intervalos = [];


    document.onkeydown = null;

    document.onkeyup = null;
}


// ==========================================
// PLATAFORMER
// ==========================================

function iniciarPlataformer() {

    let jugador = {

        x: 80,

        y: 350,

        ancho: 38,

        alto: 45,

        velocidad: 5,

        velocidadY: 0,

        salto: -13,

        vida: 3,

        invencible: 0
    };


    let teclas = {};

    let balas = [];

    let enemigos = [];

    let monedas = [];

    let puntos = 0;

    let nivel = 1;


    let plataformas = [

        {
            x: 0,
            y: 500,
            ancho: 900,
            alto: 50
        },

        {
            x: 100,
            y: 390,
            ancho: 170,
            alto: 20
        },

        {
            x: 350,
            y: 330,
            ancho: 170,
            alto: 20
        },

        {
            x: 600,
            y: 260,
            ancho: 170,
            alto: 20
        },

        {
            x: 730,
            y: 400,
            ancho: 130,
            alto: 20
        }
    ];


    // ===============================
    // CONTROLES
    // ===============================

    document.onkeydown = function(e) {

        teclas[e.key] = true;


        if (e.key === " ") {

            e.preventDefault();


            balas.push({

                x:
                    jugador.x +
                    jugador.ancho / 2,

                y:
                    jugador.y,

                ancho: 6,

                alto: 12,

                velocidad: 9
            });
        }
    };


    document.onkeyup = function(e) {

        teclas[e.key] = false;
    };


    // ===============================
    // ENEMIGOS
    // ===============================

    enemigos.push({

        x: 500,

        y: 450,

        ancho: 35,

        alto: 35,

        velocidad: 1.5,

        vida: 2
    });


    enemigos.push({

        x: 700,

        y: 450,

        ancho: 35,

        alto: 35,

        velocidad: 2,

        vida: 2
    });


    // ===============================
    // MONEDAS
    // ===============================

    monedas = [

        {
            x: 180,
            y: 350
        },

        {
            x: 430,
            y: 290
        },

        {
            x: 680,
            y: 220
        }
    ];


    // ===============================
    // ACTUALIZAR
    // ===============================

    function actualizar() {

        // Movimiento

        if (teclas["ArrowLeft"]) {

            jugador.x -=
                jugador.velocidad;
        }


        if (teclas["ArrowRight"]) {

            jugador.x +=
                jugador.velocidad;
        }


        // Salto

        if (
            (teclas["ArrowUp"] ||
            teclas["w"]) &&
            jugador.enSuelo
        ) {

            jugador.velocidadY =
                jugador.salto;
        }


        // Gravedad

        jugador.velocidadY +=
            0.6;

        jugador.y +=
            jugador.velocidadY;


        jugador.enSuelo = false;


        // Plataformas

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
                p.y + 25 &&

                jugador.velocidadY >= 0

            ) {

                jugador.y =
                    p.y -
                    jugador.alto;

                jugador.velocidadY = 0;

                jugador.enSuelo = true;
            }

        });


        // Límites

        if (jugador.x < 0)
            jugador.x = 0;


        if (
            jugador.x +
            jugador.ancho >
            canvas.width
        ) {

            jugador.x =
                canvas.width -
                jugador.ancho;
        }


        // Caída

        if (
            jugador.y >
            canvas.height
        ) {

            perderVida();
        }


        // Balas

        balas.forEach(b => {

            b.x +=
                0;

            b.y -=
                b.velocidad;
        });


        balas =
            balas.filter(
                b =>
                    b.y > -20
            );


        // Enemigos

        enemigos.forEach(enemigo => {

            if (
                enemigo.x <
                jugador.x
            ) {

                enemigo.x +=
                    enemigo.velocidad;
            }


            if (
                enemigo.x >
                jugador.x
            ) {

                enemigo.x -=
                    enemigo.velocidad;
            }
        });


        // Colisión bala-enemigo

        for (
            let i =
                balas.length - 1;
            i >= 0;
            i--
        ) {

            for (
                let j =
                    enemigos.length - 1;
                j >= 0;
                j--
            ) {

                let b =
                    balas[i];

                let e =
                    enemigos[j];


                if (

                    b.x <
                    e.x + e.ancho &&

                    b.x + b.ancho >
                    e.x &&

                    b.y <
                    e.y + e.alto &&

                    b.y + b.alto >
                    e.y

                ) {

                    e.vida--;

                    balas.splice(
                        i,
                        1
                    );


                    if (
                        e.vida <= 0
                    ) {

                        enemigos.splice(
                            j,
                            1
                        );

                        puntos += 100;
                    }

                    break;
                }
            }
        }


        // Colisión jugador-enemigo

        enemigos.forEach(e => {

            if (

                jugador.x <
                e.x + e.ancho &&

                jugador.x +
                jugador.ancho >
                e.x &&

                jugador.y <
                e.y + e.alto &&

                jugador.y +
                jugador.alto >
                e.y

            ) {

                if (
                    jugador.invencible <= 0
                ) {

                    perderVida();
                }
            }
        });


        // Monedas

        monedas.forEach((moneda, i) => {

            let distanciaX =
                jugador.x -
                moneda.x;

            let distanciaY =
                jugador.y -
                moneda.y;


            let distancia =
                Math.sqrt(
                    distanciaX *
                    distanciaX +
                    distanciaY *
                    distanciaY
                );


            if (
                distancia < 40
            ) {

                monedas.splice(
                    i,
                    1
                );

                puntos += 50;
            }
        });


        if (
            jugador.invencible > 0
        ) {

            jugador.invencible--;
        }


        // Nuevo nivel

        if (
            enemigos.length === 0 &&
            monedas.length === 0
        ) {

            nivel++;

            crearNivel();
        }
    }


    function perderVida() {

        jugador.vida--;

        jugador.x = 80;

        jugador.y = 350;

        jugador.velocidadY = 0;

        jugador.invencible = 120;


        if (
            jugador.vida <= 0
        ) {

            alert(
                "GAME OVER\nPuntos: " +
                puntos
            );

            volverMenu();
        }
    }


    function crearNivel() {

        monedas = [

            {
                x:
                    Math.random() *
                    700 + 100,

                y: 350
            },

            {
                x:
                    Math.random() *
                    700 + 100,

                y: 290
            }
        ];


        for (
            let i = 0;
            i < nivel + 1;
            i++
        ) {

            enemigos.push({

                x:
                    Math.random() *
                    700 + 100,

                y: 450,

                ancho: 35,

                alto: 35,

                velocidad:
                    1.2 +
                    nivel * 0.3,

                vida:
                    1 +
                    Math.floor(
                        nivel / 2
                    )
            });
        }
    }


    // ===============================
    // DIBUJAR
    // ===============================

    function dibujar() {

        // Fondo

        ctx.fillStyle =
            "#10152b";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Estrellas

        ctx.fillStyle =
            "#ffffff";


        for (
            let i = 0;
            i < 40;
            i++
        ) {

            ctx.fillRect(

                (i * 97) %
                    canvas.width,

                (i * 53) %
                    450,

                2,
                2
            );
        }


        // Plataformas

        ctx.fillStyle =
            "#00ff88";


        plataformas.forEach(p => {

            ctx.fillRect(

                p.x,
                p.y,
                p.ancho,
                p.alto
            );
        });


        // Monedas

        monedas.forEach(m => {

            ctx.beginPath();

            ctx.arc(
                m.x,
                m.y,
                10,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#ffd700";

            ctx.fill();
        });


        // Enemigos

        enemigos.forEach(e => {

            ctx.fillStyle =
                "#ff4b2b";

            ctx.fillRect(

                e.x,
                e.y,
                e.ancho,
                e.alto
            );


            // Ojos

            ctx.fillStyle =
                "white";

            ctx.fillRect(
                e.x + 7,
                e.y + 8,
                7,
                7
            );

            ctx.fillRect(
                e.x + 21,
                e.y + 8,
                7,
                7
            );
        });


        // Jugador

        if (
            jugador.invencible === 0 ||
            Math.floor(
                jugador.invencible / 5
            ) % 2 === 0
        ) {

            ctx.fillStyle =
                "#3498ff";

            ctx.fillRect(

                jugador.x,
                jugador.y,
                jugador.ancho,
                jugador.alto
            );
        }


        // Balas

        ctx.fillStyle =
            "#ffff00";


        balas.forEach(b => {

            ctx.fillRect(

                b.x,
                b.y,
                b.ancho,
                b.alto
            );
        });


        // HUD

        ctx.fillStyle =
            "white";

        ctx.font =
            "18px Arial";


        ctx.fillText(
            "❤️ " +
            jugador.vida,
            20,
            30
        );


        ctx.fillText(
            "⭐ " +
            puntos,
            100,
            30
        );


        ctx.fillText(
            "Nivel " +
            nivel,
            220,
            30
        );


        ctx.fillText(
            "← → mover | ↑ saltar | ESPACIO disparar",
            20,
            535
        );
    }


    function juego() {

        if (
            juegoActual !==
            "plataformer"
        ) {

            return;
        }


        actualizar();

        dibujar();


        animacion =
            requestAnimationFrame(
                juego
            );
    }


    juego();
}


// ==========================================
// SNAKE MEJORADO
// ==========================================

function iniciarSnake() {

    const tamaño = 20;

    let snake = [

        {
            x: 440,
            y: 260
        },

        {
            x: 420,
            y: 260
        },

        {
            x: 400,
            y: 260
        }
    ];


    let comida = crearComida();


    let direccion =
        "derecha";

    let siguienteDireccion =
        "derecha";

    let puntos = 0;

    let velocidad = 130;


    document.onkeydown = function(e) {

        if (
            e.key === "ArrowUp" &&
            direccion !== "abajo"
        ) {

            siguienteDireccion =
                "arriba";
        }


        if (
            e.key === "ArrowDown" &&
            direccion !== "arriba"
        ) {

            siguienteDireccion =
                "abajo";
        }


        if (
            e.key === "ArrowLeft" &&
            direccion !== "derecha"
        ) {

            siguienteDireccion =
                "izquierda";
        }


        if (
            e.key === "ArrowRight" &&
            direccion !== "izquierda"
        ) {

            siguienteDireccion =
                "derecha";
        }
    };


    function crearComida() {

        return {

            x:
                Math.floor(
                    Math.random() *
                    (canvas.width /
                    tamaño)
                ) * tamaño,

            y:
                Math.floor(
                    Math.random() *
                    (canvas.height /
                    tamaño)
                ) * tamaño
        };
    }


    function juegoSnake() {

        if (
            juegoActual !== "snake"
        ) {

            return;
        }


        direccion =
            siguienteDireccion;


        let cabeza = {

            x:
                snake[0].x,

            y:
                snake[0].y
        };


        if (
            direccion === "arriba"
        )
            cabeza.y -= tamaño;


        if (
            direccion === "abajo"
        )
            cabeza.y += tamaño;


        if (
            direccion === "izquierda"
        )
            cabeza.x -= tamaño;


        if (
            direccion === "derecha"
        )
            cabeza.x += tamaño;


        // Pared

        if (

            cabeza.x < 0 ||

            cabeza.x >=
                canvas.width ||

            cabeza.y < 0 ||

            cabeza.y >=
                canvas.height

        ) {

            gameOver();

            return;
        }


        // Cuerpo

        for (
            let i = 0;
            i < snake.length;
            i++
        ) {

            if (
                cabeza.x ===
                    snake[i].x &&

                cabeza.y ===
                    snake[i].y
            ) {

                gameOver();

                return;
            }
        }


        snake.unshift(
            cabeza
        );


        // Comer

        if (

            cabeza.x ===
                comida.x &&

            cabeza.y ===
                comida.y

        ) {

            puntos += 10;


            comida =
                crearComida();


            if (
                velocidad > 55
            ) {

                velocidad -= 3;
            }

        } else {

            snake.pop();
        }


        dibujarSnake();


        intervalo =
            setTimeout(
                juegoSnake,
                velocidad
            );
    }


    function gameOver() {

        alert(
            "🐍 GAME OVER\n\nPuntuación: " +
            puntos
        );


        volverMenu();
    }


    function dibujarSnake() {

        ctx.fillStyle =
            "#071b16";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Cuadrícula

        ctx.strokeStyle =
            "#12352d";

        ctx.lineWidth = 1;


        for (
            let x = 0;
            x < canvas.width;
            x += tamaño
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                0
            );

            ctx.lineTo(
                x,
                canvas.height
            );

            ctx.stroke();
        }


        for (
            let y = 0;
            y < canvas.height;
            y += tamaño
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                canvas.width,
                y
            );

            ctx.stroke();
        }


        // Comida

        ctx.fillStyle =
            "#ff3355";


        ctx.beginPath();

        ctx.arc(

            comida.x + 10,
            comida.y + 10,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Serpiente

        snake.forEach(
            (parte, i) => {

                ctx.fillStyle =
                    i === 0
                    ? "#00ff88"
                    : "#00c875";


                ctx.fillRect(

                    parte.x + 1,
                    parte.y + 1,
                    18,
                    18
                );
            }
        );


        // HUD

        ctx.fillStyle =
            "white";

        ctx.font =
            "20px Arial";


        ctx.fillText(
            "Puntos: " +
            puntos,
            20,
            30
        );
    }


    juegoSnake();
}


// ==========================================
// SPACE SHOOTER MEJORADO
// ==========================================

function iniciarShooter() {

    let nave = {

        x: 430,

        y: 470,

        ancho: 40,

        alto: 35,

        velocidad: 7,

        vida: 3
    };


    let teclas = {};

    let balas = [];

    let enemigos = [];

    let puntos = 0;

    let oleada = 1;

    let tiempoDisparo = 0;


    document.onkeydown = function(e) {

        teclas[e.key] = true;


        if (
            e.key === " "
        ) {

            e.preventDefault();
        }
    };


    document.onkeyup = function(e) {

        teclas[e.key] = false;
    };


    // Crear enemigos

    let generador =
        setInterval(
            crearEnemigo,
            700
        );


    intervalos.push(
        generador
    );


    function crearEnemigo() {

        if (
            juegoActual !==
            "shooter"
        ) {

            return;
        }


        let tipo =
            Math.random();


        if (
            tipo < 0.7
        ) {

            enemigos.push({

                x:
                    Math.random() *
                    860,

                y: -40,

                ancho: 35,

                alto: 35,

                velocidad:
                    2 +
                    oleada *
                    0.15,

                vida: 1,

                tipo: "normal"
            });

        } else {

            enemigos.push({

                x:
                    Math.random() *
                    860,

                y: -40,

                ancho: 45,

                alto: 45,

                velocidad:
                    1.2 +
                    oleada *
                    0.1,

                vida: 3,

                tipo: "fuerte"
            });
        }
    }


    function actualizar() {

        // Nave

        if (
            teclas["ArrowLeft"]
        ) {

            nave.x -=
                nave.velocidad;
        }


        if (
            teclas["ArrowRight"]
        ) {

            nave.x +=
                nave.velocidad;
        }


        if (
            nave.x < 0
        ) {

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


        // Disparo

        if (
            teclas[" "] &&
            tiempoDisparo <= 0
        ) {

            balas.push({

                x:
                    nave.x +
                    nave.ancho / 2 -
                    3,

                y:
                    nave.y,

                ancho: 6,

                alto: 16,

                velocidad: 10
            });


            tiempoDisparo = 12;
        }


        tiempoDisparo--;


        // Balas

        balas.forEach(
            b => {

                b.y -=
                    b.velocidad;
            }
        );


        balas =
            balas.filter(
                b =>
                    b.y > -30
            );


        // Enemigos

        enemigos.forEach(
            e => {

                e.y +=
                    e.velocidad;
            }
        );


        // Colisiones

        for (
            let i =
                balas.length - 1;
            i >= 0;
            i--
        ) {

            for (
                let j =
                    enemigos.length - 1;
                j >= 0;
                j--
            ) {

                let b =
                    balas[i];

                let e =
                    enemigos[j];


                if (

                    b.x <
                    e.x + e.ancho &&

                    b.x +
                    b.ancho >
                    e.x &&

                    b.y <
                    e.y + e.alto &&

                    b.y +
                    b.alto >
                    e.y

                ) {

                    e.vida--;

                    balas.splice(
                        i,
                        1
                    );


                    if (
                        e.vida <= 0
                    ) {

                        enemigos.splice(
                            j,
                            1
                        );


                        puntos +=
                            e.tipo ===
                            "fuerte"
                            ? 50
                            : 20;
                    }


                    break;
                }
            }
        }


        // Enemigos llegan al jugador

        for (
            let i =
                enemigos.length - 1;
            i >= 0;
            i--
        ) {

            let e =
                enemigos[i];


            if (
                e.y >
                canvas.height
            ) {

                enemigos.splice(
                    i,
                    1
                );


                nave.vida--;


                if (
                    nave.vida <= 0
                ) {

                    alert(
                        "🚀 GAME OVER\n\nPuntos: " +
                        puntos
                    );


                    volverMenu();

                    return;
                }
            }
        }


        // Oleada

        if (
            puntos >=
            oleada * 200
        ) {

            oleada++;
        }
    }


    function dibujar() {

        // Fondo espacial

        ctx.fillStyle =
            "#030315";

        ctx.fillRect(

            0,
            0,
            canvas.width,
            canvas.height
        );


        // Estrellas

        for (
            let i = 0;
            i < 80;
            i++
        ) {

            let x =
                (i * 113) %
                canvas.width;

            let y =
                (i * 71 +
                Date.now() * 0.03)
                %
                canvas.height;


            ctx.fillStyle =
                "white";


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


        ctx.beginPath();

        ctx.moveTo(
            nave.x +
            nave.ancho / 2,
            nave.y
        );

        ctx.lineTo(
            nave.x,
            nave.y +
            nave.alto
        );

        ctx.lineTo(
            nave.x +
            nave.ancho,
            nave.y +
            nave.alto
        );

        ctx.closePath();

        ctx.fill();


        // Balas

        ctx.fillStyle =
            "#ffff00";


        balas.forEach(
            b => {

                ctx.fillRect(

                    b.x,
                    b.y,
                    b.ancho,
                    b.alto
                );
            }
        );


        // Enemigos

        enemigos.forEach(
            e => {

                ctx.fillStyle =
                    e.tipo ===
                    "fuerte"
                    ? "#a855f7"
                    : "#ff3344";


                ctx.beginPath();

                ctx.arc(

                    e.x +
                    e.ancho / 2,

                    e.y +
                    e.alto / 2,

                    e.ancho / 2,

                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        );


        // HUD

        ctx.fillStyle =
            "white";

        ctx.font =
            "20px Arial";


        ctx.fillText(

            "❤️ " +
            nave.vida,

            20,
            30
        );


        ctx.fillText(

            "⭐ " +
            puntos,

            120,
            30
        );


        ctx.fillText(

            "🌊 Oleada " +
            oleada,

            230,
            30
        );


        ctx.font =
            "16px Arial";


        ctx.fillText(

            "← → Mover | ESPACIO Disparar",

            20,
            535
        );
    }


    function juego() {

        if (
            juegoActual !==
            "shooter"
        ) {

            return;
        }


        actualizar();

        dibujar();


        animacion =
            requestAnimationFrame(
                juego
            );
    }


    juego();
}
