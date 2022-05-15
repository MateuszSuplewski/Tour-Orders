// const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
// "2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log(txt.split(/[\r\n]+/gm));

// const splittedData = txt.split('"');
// //console.log(splittedData);
// const regrex = /[^,\n]/;
// const multipleTripData = splittedData.filter(word => word.match(regrex));
// console.log(multipleTripData);

const fileInput = document.querySelector(".uploader__input");
fileInput.addEventListener('change', handleFile);

function handleFile(e) {

    const file = e.target.files[0]; // tylko 1 plik posiadamy 
    const reader = new FileReader();

    reader.onload = function (readerEvent) {
        const content = readerEvent.target.result;
        console.log(content);

        const splittedData = content.split('"');
        //console.log(splittedData);
        const regrex = /[^,\n\r]/;
        const multipleTripData = splittedData.filter(word => word.match(regrex));

      

        // dodac tu caly handler ze splitem :)
            for (let i = 0; i < multipleTripData.length; i += 5) {
                const id = multipleTripData[i];
                const name = multipleTripData[i + 1];
                const description = multipleTripData[i + 2];
                const adultPrice = multipleTripData[i + 3];
                const childPrice = multipleTripData[i + 4];
        
        
                const tripPrototype = document.querySelector('.excursions__item:last-of-type');
                const trip = tripPrototype.cloneNode(true);
                trip.classList.remove('excursions__item--prototype');
                tripPrototype.parentElement.appendChild(trip);

                const tripButton = tripPrototype.nextElementSibling.querySelector('.excursions__field-input--submit');
                trip.dataset.id = id;
                tripButton.dataset.id=id;
                
                const titleEl = tripPrototype.nextElementSibling.querySelector('.excursions__title');
                titleEl.innerText = name;
                const descriptionEl =  tripPrototype.nextElementSibling.querySelector('.excursions__description');
                descriptionEl.innerText = description;

                const pricesEl = tripPrototype.nextElementSibling.querySelectorAll('.excursions__price');
                pricesEl[0].innerText = adultPrice;
                pricesEl[1].innerText = childPrice;  

            }
    };
    reader.readAsText(file, 'UTF-8');
}


const trips = document.querySelector('.excursions');
trips.addEventListener('click',addTripToCart);

function addTripToCart(e){
    e.preventDefault();

    if(e.target.type === 'submit'){
        
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
        summaryPriceEl.innerText = Number(howMany[0].value)*Number(pricesEl[0].innerText) + Number(howMany[1].value)*Number(pricesEl[1].innerText)+'PLN';
        itemSummaryPricesEl.innerText = `dorośli: ${howMany[0].value} x ${pricesEl[0].innerText}PLN, dzieci: ${howMany[1].value} x ${pricesEl[1].innerText}PLN`;
        newItem.classList.remove('summary__item--prototype');

        Cart.appendChild(newItem);

        const removeButtonEl = newItem.querySelector('.summary__btn-remove');
        removeButtonEl.addEventListener('click', removeItem);
        

    } 

  
}


function removeItem(e){
    e.preventDefault();
    console.log(e.target);
    console.log(e.currentTarget);
    const titleEl = e.target.parentElement;
    const itemEl = titleEl.parentElement;

    itemEl.remove();
}


const orderEl = document.querySelector('.order');
orderEl.addEventListener('submit',validateForm);

function validateForm(e){
    e.preventDefault();

    const nameAndLastName = orderEl.elements[0].value;
    const email = orderEl.elements[1].value;
    const errors = [];

    const nameAndLastNameRegrex =/^[a-ząćęłńóśźż]{2,} [a-ząćęłńóśźż]{2,}$/i;
    const emailRexgrex=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    let ul = e.target.querySelector('ul');
    
    if(!ul){
        const ul = document.createElement('ul');
        orderEl.appendChild(ul);
    }
    
    ul = e.target.querySelector('ul');
    const listofItems = ul.querySelectorAll('li');
    
    listofItems.forEach((item) => {
        ul.removeChild(item);
    });


    if(!nameAndLastName.match(nameAndLastNameRegrex)){
        console.log('Nie pasuje nazwa');
        errors.push('Wypełnij pole imie i nazwisko poprawnie.');
    }
    if(!email.match(emailRexgrex)){
        console.log('Nie pasuje email :/');
        errors.push('Wprowadź poprawny adres email.');
    }

    if(errors.length === 0){
        alert('Dziękujemy za złożenie zamówienia o wartości [kwota zamówienia] PLN. Szczegóły zamówienia zostały wysłane na adres e-mail: adres@wpisanywformularzu.pl.')
    }
    else{
        errors.forEach((error)=>{

            const li = document.createElement('li');
            ul.appendChild(li);
            li.innerText = error;
        });
    }

}


