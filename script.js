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

function operate (operator, a, b) {
    switch (operator) {
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
