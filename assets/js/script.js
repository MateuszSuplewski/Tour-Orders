
const fileInputEl = document.querySelector(".uploader__input");
fileInputEl.addEventListener('change', readFile);

const excursionsEl = document.querySelector('.excursions');
excursionsEl.addEventListener('submit', addExcursionToCart);

const orderEl = document.querySelector('.order');
orderEl.addEventListener('submit', handleForm);

function readFile(e) {
    const file = e.target.files[0]; // Load 1 file
    if (file && file.type.includes('text')) {
        const reader = new FileReader();

        reader.onload = function (readerEvent) {
            const content = readerEvent.target.result; // prepare data to be well formatted
            const splittedToWords = content.split('"');
            const goodValuesPattern = /[^,\n\r]/;
            const excursionsData = splittedToWords.filter(word => word.match(goodValuesPattern));

            for (let i = 0; i < excursionsData.length; i += 5) {
                const id = excursionsData[i]; // prepare data about excursion
                const name = excursionsData[i + 1];
                const description = excursionsData[i + 2];
                const adultPrice = excursionsData[i + 3];
                const childPrice = excursionsData[i + 4];

                const excursionPrototypeEl = document.querySelector('.excursions__item'); // Add new excursion
                const excursionEl = excursionPrototypeEl.cloneNode(true);
                excursionEl.classList.remove('excursions__item--prototype');
                excursionPrototypeEl.parentElement.appendChild(excursionEl);

                const titleEl = excursionEl.querySelector('.excursions__title'); // Add data to newly created excursion
                const descriptionEl = excursionEl.querySelector('.excursions__description');
                const pricesEl = excursionEl.querySelectorAll('.excursions__price');
                titleEl.innerText = name;
                descriptionEl.innerText = description;
                pricesEl[0].innerText = adultPrice;
                pricesEl[1].innerText = childPrice;
            }
        };
        reader.readAsText(file, 'UTF-8');
    }
    else {
        console.log('Można dodać handler w przypadku, gdy ktoś wprowadzi zły plik!');
    }
}


function addExcursionToCart(e) {
    e.preventDefault();
    const amountsEl = e.target.querySelectorAll('.excursions__field-input');
    const numberPattern = /^[0-9]{1,}$/
    if (amountsEl[0].value.match(numberPattern) && amountsEl[1].value.match(numberPattern)) {  // check if number
        const CartEl = document.querySelector('.panel__summary'); // clone+add new summary excursion
        const excursionSummaryPrototypeEl = CartEl.querySelector('.summary__item--prototype');
        const excursionSummaryEl = excursionSummaryPrototypeEl.cloneNode(true);
        excursionSummaryEl.classList.remove('summary__item--prototype');
        CartEl.appendChild(excursionSummaryEl);

        const titleEl = e.target.previousElementSibling.querySelector('.excursions__title');//get data from excursion
        const pricesEl = e.target.querySelectorAll('.excursions__price');


        const excursionTitleEl = excursionSummaryEl.querySelector('.summary__name');//get new summary excursion elements
        const excursionSummaryPriceEl = excursionSummaryEl.querySelector('.summary__prices');
        const summaryPriceEl = excursionSummaryEl.querySelector('.summary__total-price');

        excursionTitleEl.innerText = titleEl.innerText; // insert data from excursion to new excursion summary
        summaryPriceEl.innerText = Number(amountsEl[0].value) * Number(pricesEl[0].innerText) + Number(amountsEl[1].value) * Number(pricesEl[1].innerText) + 'PLN';
        excursionSummaryPriceEl.innerText = `dorośli: ${amountsEl[0].value} x ${pricesEl[0].innerText}PLN, dzieci: ${amountsEl[1].value} x ${pricesEl[1].innerText}PLN`;


        const removeButtonEl = excursionSummaryEl.querySelector('.summary__btn-remove'); // add remove option to newly created summary excursion
        removeButtonEl.addEventListener('click', removeExcursionFromCart);

        updateTotalPrice();
    }
}


function removeExcursionFromCart(e) {
    e.preventDefault();

    const titleEl = e.target.parentElement;
    const excursionSummaryEl = titleEl.parentElement;
    excursionSummaryEl.remove();

    updateTotalPrice();
}


function updateTotalPrice() {
    const summaryEl = document.querySelector('.summary');
    const summaryPrices = summaryEl.querySelectorAll('.summary__total-price')
    const totalPriceEl = document.querySelector('.order__total-price-value'); // Change total price while adding new excursion
    let totalPrice = 0;
    summaryPrices.forEach((price) => { // Add every excursion price inside cart
        totalPrice += Number(price.innerText.replace('PLN', ''));
    });
    totalPrice += 'PLN';
    totalPriceEl.innerText = totalPrice;
}


function handleForm(e) {
    e.preventDefault();

    const nameAndLastName = orderEl.elements[0].value;
    const email = orderEl.elements[1].value;
    const errors = [];

    const nameAndLastNamePattern = /^[a-ząćęłńóśźż]{2,} [a-ząćęłńóśźż]{2,}$/i;
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const totalPrice = orderEl.querySelector('.order__total-price-value').innerText;

    if (!nameAndLastName.match(nameAndLastNamePattern)) errors.push('Wypełnij pole imie i nazwisko poprawnie');
    if (!email.match(emailPattern)) errors.push('Wprowadź poprawny adres email');

    if (errors.length === 0) alert(`Dziękujemy za złożenie zamówienia o wartości ${totalPrice}. Szczegóły zamówienia zostały wysłane na adres e-mail: ${email}`);
    else {
        let ul = e.target.querySelector('ul');

        if (!ul) { // create list if doesn't exist
            const ul = document.createElement('ul');
            orderEl.appendChild(ul);
        }

        ul = e.target.querySelector('ul');
        const ErrorElements = ul.querySelectorAll('li');

        ErrorElements.forEach((error) => {
            ul.removeChild(error);
        });

        errors.forEach((error) => {
            const li = document.createElement('li');
            ul.appendChild(li);
            li.innerText = error;
        });
    }
}


