//Creating the login functionality on the website

function logMeIn() {

    // Taking in a username and password
    let user, pass;

    user = $('#email').val();
    pass = $('#password').val();

    // If the following details are entered then the user has logged in successfully
    if(user == "ssingh208@caledonian.ac.uk" && pass == "password" ){
        alert('Logged In')
        localStorage.setItem('logged_in', 'true');
        window.location.href = "/quiz.html";
    } else {
        // Otherwise, a message appears telling them they have not logged in
        alert('Invalid Login')
        localStorage.setItem('logged_in', 'false'); 
    }

}

// Logout button
function logOut() {
    localStorage.setItem('logged_in', 'false'); 
    alert('You are now logged out!');
    window.location.href = "/index.html";
}

// Clear car button clears the last saved car for that user that's logged in
function clearCar() {
    localStorage.setItem('newCar', ''); 
    window.location.href = "/quiz_more.html";
}

// The login button is shown when applicable otherwise hidden.
if(localStorage.getItem('logged_in') == 'true'){
    $('#login').hide();
    $('#logout').show();
} else {
    $('#login').show();
    $('#logout').hide();
}