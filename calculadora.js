const equations = {
    espumaAlexandrina: {
        name: 'Espuma Alexandrina',
        variables: ['volume', 'fator'],
        labels: {
            volume: 'Volume do Molde',
            fator: 'Fator de Expansão'
        },
        calculate: (inputs) => {
            const volume = parseFloat(inputs.volume);
            const fator = parseFloat(inputs.fator);

            if (isNaN(volume) || isNaN(fator)) {
                return 'Erro: Volume e Fator de Expansão devem ser números.';
            }
            if (volume <= 0 || fator <= 0) {
                return 'Erro: Os valores devem ser positivos e maiores que zero.';
            }

            const massaB = volume / (fator * 1.776);
            const massaA = massaB * 1.11;
            const massaAgua = massaB * 0.04;

            return `Ordem de adição dos componentes:\nComponente B (Poliol): ${massaB.toFixed(2)}g\nÁgua: ${massaAgua.toFixed(2)}g\nComponente A (Isocianato): ${massaA.toFixed(2)}g`;
        },
    },

    espumaBernardina: {
        name: 'Espuma Bernardina',
        variables: ['volume', 'fator'],
        labels: {
            volume: 'Volume do Molde',
            fator: 'Fator de Expansão'
        },
        calculate: (inputs) => {
            const volume = parseFloat(inputs.volume);
            const fator = parseFloat(inputs.fator);

            if (isNaN(volume) || isNaN(fator)) {
                return 'Erro: Volume e Fator de Expansão devem ser números.';
            }
            if (volume <= 0 || fator <= 0) {
                return 'Erro: Os valores devem ser positivos e maiores que zero.';
            }

            const massaB = volume / (fator * 1.776);
            const massaA = massaB * 0.97;
            const massaAgua = massaB * 0.02;

            return `Ordem de adição dos componentes:\nComponente B (Poliol): ${massaB.toFixed(2)}g\nÁgua: ${massaAgua.toFixed(2)}g\nComponente A (Isocianato): ${massaA.toFixed(2)}g`;
        },
    },
};

document.addEventListener('DOMContentLoaded', () => {

    const formView = document.getElementById('FormCalculadora');
    const resultView = document.getElementById('resultados');
    const equationSelect = document.getElementById('tipoEspuma');
    const inputsContainer = document.getElementById('inputsContainer');
    const submitButton = document.getElementById('botaoCalcular');
    const resultEquationName = document.getElementById('resultEquationName');
    const resultText = document.getElementById('resultText');
    const resetButton = document.getElementById('resetButton');
    const calcForm = document.getElementById('calcForm');

    if (!formView || !resultView || !equationSelect || !inputsContainer || !calcForm || !submitButton || !resetButton) {
        console.error("ERRO CRÍTICO: Um ou mais elementos do DOM não foram encontrados. O aplicativo não pode iniciar.");
        return;
    }

    console.log("Aplicativo da calculadora inicializado. Todos os elementos do DOM foram encontrados.");

    formView.classList.remove('hidden');
    resultView.classList.add('hidden');

    function populateDropdown() {
        Object.keys(equations).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = equations[key].name;
            equationSelect.appendChild(option);
        });
    }

    function updateInputs() {
        const equationType = equationSelect.value;
        inputsContainer.innerHTML = '';

        if (!equationType) {
            inputsContainer.classList.add('hidden');
            submitButton.classList.add('hidden');
            return;
        }

        const selectedEquation = equations[equationType];

        const title = document.createElement('h2');
        title.className = "text-lg font-semibold text-gray-700 mb-4 mt-6";
        title.textContent = "2. Insira as variáveis:";
        inputsContainer.appendChild(title);

        selectedEquation.variables.forEach(varName => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mb-4';

            const label = document.createElement('label');
            label.htmlFor = varName;
            label.textContent = selectedEquation.labels[varName];
            label.className = "block text-sm font-medium text-gray-600 mb-1";

            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.id = varName;
            input.name = varName;
            if (varName === 'volume') {
                input.placeholder = "Insira o volume do molde em cm³";
            } else if (varName === 'fator') {
                input.placeholder = "Insira o fator de expansão";
            } else {
                input.placeholder = `Digite o valor de "${varName}"`;
            }
            input.required = true;
            input.className = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            inputsContainer.appendChild(wrapper);
        });

        inputsContainer.classList.remove('hidden');
        submitButton.classList.remove('hidden');
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Formulário enviado!");
        const equationType = equationSelect.value;
        const selectedEquation = equations[equationType];

        if (!selectedEquation) return;

        const formData = new FormData(calcForm);
        const inputs = {};
        selectedEquation.variables.forEach(varName => {
            inputs[varName] = formData.get(varName);
        });

        let calcResult;
        try {
            calcResult = selectedEquation.calculate(inputs);
        } catch (error) {
            calcResult = `Ocorreu um erro inesperado: ${error.message}`;
        }

        if (resultEquationName) resultEquationName.textContent = selectedEquation.name;
        if (resultText) resultText.textContent = calcResult;
        formView.classList.add('hidden');
        resultView.classList.remove('hidden');
    }

    function handleReset() {
        calcForm.reset();
        inputsContainer.innerHTML = '';
        inputsContainer.classList.add('hidden');
        submitButton.classList.add('hidden');
        equationSelect.value = '';
        formView.classList.remove('hidden');
        resultView.classList.add('hidden');
    }

    populateDropdown();
    equationSelect.addEventListener('change', updateInputs);
    calcForm.addEventListener('submit', handleSubmit);
    resetButton.addEventListener('click', handleReset);
})