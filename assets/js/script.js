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
        console.log(multipleTripData);

        // dodac tu caly handler ze splitem :)
    };

    reader.readAsText(file, 'UTF-8');

    for (let i = 0; i < multipleTripData.length; i += 5) {
        const id = multipleTripData[i];
        const name = multipleTripData[i + 1];
        const description = multipleTripData[i + 2];
        const adultPrice = multipleTripData[i + 3];
        const childPrice = multipleTripData[i + 4];


    }


}