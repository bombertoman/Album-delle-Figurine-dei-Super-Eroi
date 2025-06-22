// Funzione per verificare la validità della password
function isValidPassword(password) {
    const minLength = 8;
    return password.length >= minLength;
}