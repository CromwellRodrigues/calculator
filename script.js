let firstNumber = "";
let secondNumber = "";
let operator = null;

let justEvaluated = false;


const expressionLine = document.getElementById("expressionLine");
const resultLine = document.getElementById("resultLine");
const buttons = document.querySelectorAll("#buttons .btn");

const decimalButton = document.querySelector('[data-value="."]');


function add (a, b) {
    return a + b;
}

function subtract (a, b) {
    return a - b;
}

function multiply (a, b) {
    return a * b;
}


function divide (a, b) {
    if (b === 0) {
        return 'Error: Division by zero is undefined.';
    }
    return a / b;
}

function percentage (a, b) {
    if (b === 0) {
        return 'Error: Division by zero is undefined.';
    }   
    return (a / b) * 100;
}



function operate (currentOperator, a, b) {
    switch (currentOperator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        case '%':
            return percentage(a, b);
    
        default:
            return 'Error: Invalid operator.';  

    }
}




// function that actually appends clicked digits to the active number variable.


function renderDisplay(expressionText, resultText) {
    expressionLine.textContent = expressionText || "";
    resultLine.textContent = resultText || "0";
}


function renderFromState() {
    const expressionText = `${firstNumber} ${operator ?? ""} ${secondNumber}`

    // If no operator yet, user is editing first number, otherwise second number
    const currentValue = operator === null 
    ? (firstNumber || "0")
    : (secondNumber || "0");

    renderDisplay(expressionText, currentValue);
}

function updateDecimalButtonState() {
    if(!decimalButton) return; 

    const activeNumber = operator === null ? firstNumber : secondNumber;
    decimalButton.disabled = activeNumber.includes(".");

}

function appendDigit(digit) {
    if (justEvaluated && operator === null) {
      firstNumber = digit;
      secondNumber = "";
      justEvaluated = false;
      renderFromState();
      updateDecimalButtonState()
      return;
    }

    if (operator === null) {
        firstNumber += digit;
         
    }
    else { 
        secondNumber += digit;
        
    }
    renderFromState();  
    updateDecimalButtonState();
}


function appendDecimal() {
    if (justEvaluated && operator === null) {
        firstNumber = "0.";
        secondNumber = "";
        justEvaluated = false;
        renderFromState();
        updateDecimalButtonState();
        return;
    }

    if (operator === null) {
        if (firstNumber.includes(".")) return;
        if (firstNumber === "") firstNumber = "0";
        firstNumber += ".";
        renderFromState();
        updateDecimalButtonState();
        return;
    }

     if (secondNumber.includes(".")) return;
    if (secondNumber === "") secondNumber = "0";
    secondNumber += ".";
    renderFromState();
    updateDecimalButtonState();
}


function formatResult(result) {
    if (typeof result !== 'number' || !Number.isFinite(result)) {
        return String(result);
    } 
    const rounded = Math.round(result * 1e6) / 1e6;
    return String(rounded);

}
function evaluateExpression() {
    if (firstNumber === "" || operator === null || secondNumber === "") {
        return;
    }

    const expressionText = `${firstNumber} ${operator} ${secondNumber} =`;
    const a = Number(firstNumber);
    const b = Number(secondNumber);
    const result = operate(operator, a, b);
    const displayResult = formatResult(result);

    
    renderDisplay(expressionText, String(displayResult));

    firstNumber = String(displayResult);
    secondNumber = "";
    operator = null;
    justEvaluated = true;
    updateDecimalButtonState();
}


function backspaceInput() {
    if (justEvaluated && operator === null) {
        justEvaluated = false;
    }

    if (operator === null) {
        firstNumber = firstNumber.slice(0, -1);
       renderFromState();
        updateDecimalButtonState();
        return;
    }
    if (secondNumber !== "") {
        secondNumber = secondNumber.slice(0, -1);
        renderFromState();
        updateDecimalButtonState();
        return;

    }

    operator = null
   renderFromState();  
    updateDecimalButtonState();

}

   // check for C clear button

function clearAll() {
        firstNumber="";
        secondNumber="";
        operator = null;
        justEvaluated = false;
        renderDisplay("", "0");
        updateDecimalButtonState();
        

}

//  add handleButtonClick(event) so button clicks call appendDigit() for numbers and set operator for operator buttons

function handleInput(value) {
    
    // check if value is a digit
    if(/^\d+$/.test(value)) {
        appendDigit(value);
        return;
    }

    if (value === ".") {
        appendDecimal();
        return;
    }

    if (value === "DEL") {
        backspaceInput();
        return;
    }


    if (value === "C") {
        clearAll();
        return;
    }


    // check if value is an operator
    if (['+', '-', '*', '/', '%'].includes(value)) {
        if (firstNumber === "") {
            return;
        }
        if (operator !== null && secondNumber !== "") {
            evaluateExpression();
        }
        operator = value;
        justEvaluated = false;
        updateDecimalButtonState();
        return;
    }
       
   
    // check for equals button
    if (value === "=") {
        evaluateExpression();

    }
} 



function handleButtonClick(event) {
    const value = event.currentTarget.dataset.value;
    if (!value) return;
    handleInput(value);

}



function handleKeyDown(event) {
    const key = event.key
    let value = null;

    
    if (/^\d$/.test(key)) value = key;
    else if (key === ".") value = ".";
    else if (["+", "-", "*", "/", "%"].includes(key)) value = key;
    else if (key === "Enter" || key === "=") value = "=";
    else if (key === "Backspace") value = "DEL";
    else if (key === "Escape" || key.toLowerCase() === "c") value = "C";

    if (value === null) return;

    if (key === "Backspace") {
        event.preventDefault();
    }

    handleInput(value); 
}

buttons.forEach((button) => {
    button.addEventListener('click', handleButtonClick);
})
document.addEventListener('keydown', handleKeyDown);

renderDisplay("", "0"); 
updateDecimalButtonState();