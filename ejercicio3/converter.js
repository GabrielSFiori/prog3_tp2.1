class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.currencies = [];
    }

    async getCurrencies() {
        try {
            const response = await fetch(`${this.apiUrl}/currencies`);
            if (!response.ok) {
                throw new Error(`Fallo la carga de las monedas: ${response.statusText}`);
            }
            const data = await response.json();
            this.currencies = Object.keys(data).map(code => new Currency(code, data[code]));
        } catch (error) {
            console.error('Error al cargar las monedas:', error);
        }
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency.code === toCurrency.code) {
            return amount;
        }

        try {
            const response = await fetch(`${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`);
            if (!response.ok) {
                throw new Error(`Fallo la conversión de monedas: ${response.statusText}`);
            }
            const data = await response.json();
            return data.rates[toCurrency.code] * amount;
        } catch (error) {
            console.error('Error al realizar la conversión de monedas:', error);
            return null;
        }
    }

    async getExchangeRate(date, fromCurrency, toCurrency) {
        try {
            const formattedDate = date.toISOString().slice(0, 10);
            const response = await fetch(`${this.apiUrl}/${formattedDate}`);
            if (!response.ok) {
                throw new Error(`Fallo la carga de la tasa de cambio: ${response.statusText}`);
            }
            const data = await response.json();
            return data.rates[toCurrency.code] / data.rates[fromCurrency.code];
        } catch (error) {
            console.error('Error al cargar la tasa de cambio:', error);
            return null;
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");
    const apiUrl = "https://api.frankfurter.app";
    const converter = new CurrencyConverter(apiUrl);

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = parseFloat(document.getElementById("amount").value); // en esta linea tuve que agregar una validacion con parseFloat porque tenia errores al ejecutar la conversion
        const fromCurrencyCode = fromCurrencySelect.value;
        const toCurrencyCode = toCurrencySelect.value;

        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencyCode
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencyCode
        );
        const date = new Date('2022-01-01');
        const exchangeRate = await converter.getExchangeRate(date, fromCurrency, toCurrency);
        console.log(`Tasa de cambio entre ${fromCurrency.code} y ${toCurrency.code} en ${date.toISOString().slice(0, 10)}: ${exchangeRate}`);


        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${fromCurrency.code} son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
