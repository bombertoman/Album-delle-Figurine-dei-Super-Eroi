function getCurrentUserIndex() {
    return parseInt(localStorage.getItem("currentUserIndex"));
}
function getCurrentUser() {
    const currentUserIndex = getCurrentUserIndex();
    const users = JSON.parse(localStorage.getItem("users"));
    return users[currentUserIndex] || null;
}

function getCurrentUserItem(key) {
    const currentUser = getCurrentUser();
    if (currentUser === null) {
        return null;
    }
    return currentUser[key];
}

function updateCurrentUser(updatedUser){
    const users = JSON.parse(localStorage.getItem("users"));
    const currentUserIndex = getCurrentUserIndex();
    users[currentUserIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
}

function setCurrentUserItem(key, value) {
    const currentUser = getCurrentUser();
    currentUser[key] = value;
    updateCurrentUser(currentUser);
}

function deleteCurrentUser() {
    const users = JSON.parse(localStorage.getItem("users"));
    const currentUserIndex = getCurrentUserIndex();
    users.splice(currentUserIndex, 1);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("currentUserIndex");
}