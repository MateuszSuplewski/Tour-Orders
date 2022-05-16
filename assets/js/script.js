
const fileInputEl = document.querySelector(".uploader__input");
fileInputEl.addEventListener('change', readFile);

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

                const excursionPrototypeEl = document.querySelector('.excursions__item:last-of-type'); // Add new excursion
                const excursionEl = excursionPrototypeEl.cloneNode(true);
                if (excursionEl.classList.contains('excursions__item--prototype')) excursionEl.classList.remove('excursions__item--prototype');
                excursionPrototypeEl.parentElement.appendChild(excursionEl);

                const submitButton = excursionEl.querySelector('.excursions__field-input--submit');
                const titleEl = excursionEl.querySelector('.excursions__title'); // Add data to newly created excursion
                const descriptionEl = excursionEl.querySelector('.excursions__description');
                const pricesEl = excursionEl.querySelectorAll('.excursions__price');
                excursionEl.dataset.id = id; // Add dataset id to easy find which excursion should be added to cart!
                submitButton.dataset.id = id;
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




const excursionsEl = document.querySelector('.excursions');
excursionsEl.addEventListener('click', addTripToCart);
const basket = [];


function addTripToCart(e) {
    e.preventDefault();

    if (e.target.type === 'submit') {

        const Cart = document.querySelector('.panel__summary');
        const itemPrototype = Cart.querySelector('.summary__item--prototype');
        const newItem = itemPrototype.cloneNode(true);
        newItem.classList.remove('summary__item--prototype');

        //e.currentTarget

        const id = e.target.dataset.id;

        const data = e.currentTarget.querySelector(`[data-id="${id}"]`);
        const titleEl = data.querySelector('.excursions__title');
        const pricesEl = data.querySelectorAll('.excursions__price');
        const howMany = data.querySelectorAll('.excursions__field-input');

        const itemTitleEl = newItem.querySelector('.summary__name');
        const itemSummaryPricesEl = newItem.querySelector('.summary__prices');
        const summaryPriceEl = newItem.querySelector('.summary__total-price');


        itemTitleEl.innerText = titleEl.innerText;
        summaryPriceEl.innerText = Number(howMany[0].value) * Number(pricesEl[0].innerText) + Number(howMany[1].value) * Number(pricesEl[1].innerText) + 'PLN';
        itemSummaryPricesEl.innerText = `dorośli: ${howMany[0].value} x ${pricesEl[0].innerText}PLN, dzieci: ${howMany[1].value} x ${pricesEl[1].innerText}PLN`;
        newItem.classList.remove('summary__item--prototype');

        Cart.appendChild(newItem);

        const removeButtonEl = newItem.querySelector('.summary__btn-remove');
        removeButtonEl.addEventListener('click', removeItem);




        const totalPriceEl = document.querySelector('.order__total-price-value');
        let prevValue = totalPriceEl.innerText;
        let actualValue = summaryPriceEl.innerText;
        totalPriceEl.innerText = Number(prevValue.replace('PLN', '')) + Number(actualValue.replace('PLN', '')) + 'PLN';


    }
}


function removeItem(e) {
    e.preventDefault();
    console.log(e.target);
    console.log(e.currentTarget);
    const titleEl = e.target.parentElement;
    const itemEl = titleEl.parentElement;

    itemEl.remove();

    const totalPriceEl = document.querySelector('.order__total-price-value');
    const price = e.target.previousElementSibling;
    let prevValue = totalPriceEl.innerText;
    let actualValue = price.innerText;

    totalPriceEl.innerText = Number(prevValue.replace('PLN', '')) - Number(actualValue.replace('PLN', '')) + 'PLN';
}


const orderEl = document.querySelector('.order');
orderEl.addEventListener('submit', validateForm);

function validateForm(e) {
    e.preventDefault();

    const nameAndLastName = orderEl.elements[0].value;
    const email = orderEl.elements[1].value;
    const errors = [];

    const nameAndLastNameRegrex = /^[a-ząćęłńóśźż]{2,} [a-ząćęłńóśźż]{2,}$/i;
    const emailRexgrex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const totalPrice = document.querySelector('.order__total-price-value').innerText;

    let ul = e.target.querySelector('ul');

    if (!ul) {
        const ul = document.createElement('ul');
        orderEl.appendChild(ul);
    }

    ul = e.target.querySelector('ul');
    const listofItems = ul.querySelectorAll('li');

    listofItems.forEach((item) => {
        ul.removeChild(item);
    });


    if (!nameAndLastName.match(nameAndLastNameRegrex)) {
        console.log('Nie pasuje nazwa');
        errors.push('Wypełnij pole imie i nazwisko poprawnie.');
    }
    if (!email.match(emailRexgrex)) {
        console.log('Nie pasuje email :/');
        errors.push('Wprowadź poprawny adres email.');
    }

    if (errors.length === 0) {
        alert(`Dziękujemy za złożenie zamówienia o wartości ${totalPrice}. Szczegóły zamówienia zostały wysłane na adres e-mail: ${email}`);
    }
    else {
        errors.forEach((error) => {

            const li = document.createElement('li');
            ul.appendChild(li);
            li.innerText = error;
        });
    }

}


