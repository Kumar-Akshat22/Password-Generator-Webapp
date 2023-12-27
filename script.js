// Fetching the values
const inputSlider = document.querySelector('[datalengthSlider]');
const lengthdisplay = document.querySelector('[data-lengthNumber]');
const passworddisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numberCheck = document.querySelector('#numbers');
const symbolCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[strength-indicator]');
const generatePass = document.querySelector('.generateButton');
const allcheckbox = document.querySelectorAll('input[type=checkbox]');
const symbols = '~`!@#$%^&*()_-+={}[]\|:;"<,>.?/';

let password = "";
let passwordLength = 10 ;
let checkCount = 0;
handleSlider();

// Set the color indicator to gray
setIndicator("#ccc");

// The following function displays the updated Password Length on the UI
function handleSlider(){

    inputSlider.value = passwordLength;
    lengthdisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min ) *100 / (max-min)) + "% 100%";
    

}

// Set color indicator according to the password strength
function setIndicator(color){

    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Following function generates a random Integer
function getRandomInteger(min , max){

    return Math.floor(Math.random() * (max-min)) + min; 

}

// Following function generates Random Number
function generateRandomNumber(){

    return getRandomInteger(0 , 9);
}

// Following function generates the LowerCase Letters for the Password
function generateLowerCase(){

    return String.fromCharCode(getRandomInteger(97 , 123));
}

// Following function generates UpperCase Letters for the Password
function generateUpperCase(){

    return String.fromCharCode(getRandomInteger(65 , 91));
}

// Following function generates symbols for the password
function generateSymbol(){

    const randNum = getRandomInteger(0 , symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked){

        hasUpper = true;
    }

    if(lowercaseCheck.checked){

        hasLower = true;
    }

    if(numberCheck.checked){

        hasNum = true;
    }

    if(symbolCheck.checked){

        hasSym = true;
    }

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8) {
        
        setIndicator("rgb(90, 255, 7)");
    }

    else if((hasLower||hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }

    else{
        
        setIndicator("#f00"); 
    }
}

async function copyContent(){

    try{

        await navigator.clipboard.writeText(passworddisplay.value);
        copyMsg.innerText = "Copied";
    }

    catch(e){

        copyMsg.innerText = "Failed";
    }

    // To make the copied text visible
    copyMsg.classList.add("active");

    // To make the copied text invisible
    setTimeout( () => {
        copyMsg.classList.remove("active");
    } , 2000);

}

function handlecheckboxChange(){

    checkCount = 0;
    allcheckbox.forEach( (checkbox) => {

        if(checkbox.checked){

            checkCount++;
        }
    });

    if(passwordLength < checkCount){

        passwordLength = checkCount;
        handleSlider();
    };
}

function shufflePassword(array){

    // Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--){

        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;    
    }

    let str = "";
    array.forEach((element) => (str += element));
    return str;


}

// Adding Event Listeners
allcheckbox.forEach( (checkbox) => {

    checkbox.addEventListener('change' , handlecheckboxChange);
});

inputSlider.addEventListener('input' , (e) => {

    passwordLength = e.target.value;
    handleSlider();

});

copyBtn.addEventListener('click' , () => {

    if(passworddisplay.value){

        copyContent();
    }
});

generatePass.addEventListener('click' , () => {

    // None of the checkbox checked 
    if(checkCount == 0){
        return;

    }

    if(passwordLength < checkCount){

        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find the password

    // Reset old password
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked){

        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){

        funcArr.push(generateLowerCase);
    }

    if(numberCheck.checked){

        funcArr.push(generateRandomNumber);
    }

    if(symbolCheck.checked){

        funcArr.push(generateSymbol);
    }

    // Compulsory addition 
    for(let i = 0; i<funcArr.length; i++){

        password += funcArr[i]();
    }

    // Remaining Addition
    for(let i = 0; i < (passwordLength-funcArr.length); i++){

        let randIndex = getRandomInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Displaying the Password
    passworddisplay.value = password;

    // Call strength indicator function
    calcStrength();

});