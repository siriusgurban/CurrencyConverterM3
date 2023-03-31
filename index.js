const getCurrency = async () => {
    try {
        const response = await fetch('https://api.exchangerate.host/symbols');
        const json = await response.json();
        return json.symbols;
    } catch (error) {
        alert("Please try again later.");
    }
};

const getRate = async (from, to) => {
    try {
        const convert = await fetch(
            `https://api.exchangerate.host/convert?from=${from}&to=${to}`
        );
        const json = await convert.json();
        return json.result;
    } catch (error) {
        alert("Please try again later.");
    }
};

const addToSelection = (select, option) => {
    const optionEl = document.createElement('option');
    optionEl.value = option.code;
    optionEl.innerText = option.code;
    select.append(optionEl);
};

const addToSelect = (selectEl, optionList) => {
    optionList.forEach(option => {
        addToSelection(selectEl, option);
    });
};

const addSymbols = async () => {
    try {
        const fromEl = document.getElementById('fromEl');
        const toEl = document.getElementById('toEl');
        const currency = await getCurrency();

        const currencyList = Object.keys(currency).map(curKey => currency[curKey]);

        addToSelect(fromEl, currencyList);
        addToSelect(toEl, currencyList);
    } catch (error) {
        alert("Please try again later.")
    }
};

addSymbols();

const load = () => {
    const inputFrom = document.getElementById('inputFrom');
    const inputTo = document.getElementById('inputTo');
    const rateFromSp = document.getElementById('rateFrom');
    const rateToSp = document.getElementById('rateTo');
    const selectFrom = document.getElementById('fromEl');
    const selectTo = document.getElementById('toEl');
    const buttonsFrom = document.querySelectorAll('.left button');
    const buttonsTo = document.querySelectorAll('.right button');

    inputFrom.focus();
    const convert = async (e) => {
        const fromCurrency = selectFrom.value;
        const toCurrency = selectTo.value;
        const rate = await getRate(fromCurrency, toCurrency);
        const rateFrom = await getRate(toCurrency, fromCurrency);
        let result;

        if (e.target.parentElement.parentElement.children[2].children[0].id === 'inputFrom' || e.target.id === 'inputFrom') {
            result = (rate * Number(inputFrom.value)).toFixed(2);
            inputTo.value = result;
        } else if (e.target.parentElement.parentElement.children[2].children[0].id === 'inputTo' || e.target.id === 'inputTo') {
            result = (rateFrom * Number(inputTo.value)).toFixed(2);
            inputFrom.value = result;
        }


        rateFromSp.innerText = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        rateToSp.innerText = `1 ${toCurrency} = ${rateFrom.toFixed(4)} ${fromCurrency}`;
    };

    [inputFrom, inputTo].forEach(el => el.addEventListener('input', convert));
    [selectFrom, selectTo].forEach(el => el.addEventListener('change', convert));


    buttonsFrom.forEach(button => {
        button.addEventListener('click', e => {
            selectFrom.value = e.target.textContent;
            convert(e);
        });
    });

    buttonsTo.forEach(button => {
        button.addEventListener('click', e => {
            selectTo.value = e.target.textContent;
            convert(e);
        });
    });
};

load();

const changeClass = () => {
    const buttonsFrom = document.querySelectorAll('.left button, #fromEl');
    const buttonsTo = document.querySelectorAll('.right button, #toEl');

    const changeSelected = (buttons, e) => {
        buttons.forEach(button => {
            if (button.classList.contains('selected')) {
                button.classList.remove('selected');
            }
            e.target.classList.add('selected');
        });
    };

    buttonsFrom.forEach(button => {
        button.addEventListener('click', e => changeSelected(buttonsFrom, e));
    });

    buttonsTo.forEach(button => {
        button.addEventListener('click', e => changeSelected(buttonsTo, e));
    });
};

changeClass();