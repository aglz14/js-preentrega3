const historial = [];
let usuarioActual = null;

class Expediente {
    constructor(nombre, pasos, totalSteps, peso, tiempoCaminata, calorias) {
        this.nombre = nombre;
        this.pasos = pasos;
        this.totalSteps = totalSteps;
        this.peso = peso;
        this.tiempoCaminata = tiempoCaminata;
        this.calorias = calorias;
    }
}

const dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

function createStepsInputs() {
    const stepsList = document.getElementById('stepsList');
    dias.forEach(dia => {
        const li = document.createElement('li');
        li.innerHTML = `<label for="${dia}">${dia}:</label> <input type="number" id="${dia}">`;
        stepsList.appendChild(li);
    });
}

function initializeApp() {
    // Intentar obtener datos de usuario y contraseña del localStorage al iniciar la aplicación
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
        const storedUser = JSON.parse(storedUserData);
        usuarioActual = storedUser.nombre;
        document.getElementById('loginUser').value = storedUser.loginUser; // Setear el valor del campo de usuario
        document.getElementById('loginPassword').value = storedUser.loginPassword; // Setear el valor del campo de contraseña
        document.getElementById('app').style.display = 'block';
        document.getElementById('loginBtn').style.display = 'none';
        createStepsInputs();
    }

    document.getElementById('loginBtn').addEventListener('click', () => {
        const loginUser = document.getElementById('loginUser').value;
        const loginPassword = document.getElementById('loginPassword').value;

        // Validar las credenciales (puedes agregar tu lógica de autenticación aquí)
        if (loginUser === "user" && loginPassword === "password") {
            // Mostrar la aplicación y ocultar el formulario de inicio de sesión
            document.getElementById('app').style.display = 'block';
            document.getElementById('loginBtn').style.display = 'none';
            usuarioActual = loginUser;
            createStepsInputs();

            // Guardar datos de usuario y contraseña en el localStorage
            const userData = {
                nombre: loginUser,
                loginUser: loginUser, // Guardar el nombre de usuario
                loginPassword: loginPassword // Guardar la contraseña
            };
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            alert("Credenciales incorrectas. Inténtelo de nuevo.");
        }
    });

    document.getElementById('calculateBtn').addEventListener('click', () => {
        if (!usuarioActual) {
            alert("Inicie sesión antes de continuar.");
            return;
        }

        const userName = document.getElementById('userName').value;
        const weight = parseInt(document.getElementById('weight').value);
        const walkTime = parseInt(document.getElementById('walkTime').value);

        if (!userName || isNaN(weight) || isNaN(walkTime)) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const pasos = {};
        dias.forEach(dia => {
            pasos[dia] = parseInt(document.getElementById(dia).value);
        });

        const usuario = {
            nombre: userName,
            pasos: pasos,
            peso: weight,
            tiempoCaminata: walkTime,
        };

        calculateSteps(usuario);
        calcularCalorias(usuario);
        corredores(usuario);
    });
}

function calculateSteps(usuario) {
    const actualSteps = getActualSteps(usuario);
    const idealSteps = getIdealSteps();

    let mensajePasos;

    if (actualSteps === idealSteps) {
        mensajePasos = "¡Caminaste la cantidad perfecta para mantenerte sano!";
    } else if (actualSteps > idealSteps) {
        mensajePasos = `Caminaste ${actualSteps - idealSteps} pasos extras, sigue así.`;
    } else {
        mensajePasos = `Deberías caminar un poco más, caminaste ${idealSteps - actualSteps} pasos menos de los que deberías.`;
    }

    displayMessage(mensajePasos);
}

function calcularCalorias(usuario) {
    const calorias = 0.029 * (usuario.peso * 2.2) * usuario.tiempoCaminata;
    let mensajeCalorias;

    switch (true) {
        case usuario.tiempoCaminata === 60:
            mensajeCalorias = `Quemas ${calorias} calorías al día. Caminas el tiempo suficiente para mantenerte sano.`;
            break;
        case usuario.tiempoCaminata < 60:
            mensajeCalorias = `Quemas ${calorias} calorías al día. Te recomendamos caminar por lo menos 1 hora al día.`;
            break;
        case usuario.tiempoCaminata > 60:
            mensajeCalorias = `Quemas ${calorias} calorías al día. Felicidades, eres un deportista.`;
            break;
        default:
            mensajeCalorias = "Error";
            break;
    }

    displayMessage(mensajeCalorias);
}

function getActualSteps(usuario) {
    return Object.values(usuario.pasos).reduce((total, pasosDia) => total + pasosDia, 0);
}

function getIdealSteps() {
    return 10000 * 7; // 10,000 pasos ideales por día durante 7 días
}

function displayMessage(message) {
    const outputParagraph = document.getElementById('output');
    outputParagraph.textContent = message;
}

function corredores(usuario) {
    const actualSteps = getActualSteps(usuario);
    const caloriasQuemadas = calcularCalorias(usuario);
    const registro = new Expediente(usuario.nombre, JSON.stringify(usuario.pasos), actualSteps, usuario.peso, usuario.tiempoCaminata, caloriasQuemadas);
    historial.push(registro);
    let text = `Nombre: ${usuario.nombre}, Pasos: ${JSON.stringify(usuario.pasos)}, Total de pasos: ${actualSteps}, Peso: ${usuario.peso}, Tiempo de caminata por día: ${usuario.tiempoCaminata} minutos, Calorías quemadas por día: ${caloriasQuemadas}`;
    
    alert(text);
    // Displaying the historical records (optional)
    // alert(historial.map(exp => JSON.stringify(exp)).join('\n'));
}

initializeApp();
