import index from "../index.html"
import {
    addCurrentUser,
    searchUserInLocalStorage
} from "../utils"
import {
    changeState
} from "../utils";
import {startApp} from "../app.js"



const mainPage = `
<body class="bg-light ">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">SimpleTODO</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                    </ul>
                    <form id="app-login-form" class="d-flex">
                        <input class="form-control me-2" name="login" autocomplete="username" type="text"
                            placeholder="Login" aria-label="Login">
                        <input class="form-control me-2" name="password" autocomplete="current-password" type="password"
                            placeholder="Password" aria-label="Password">
                        <button id="app-login-btn" class="btn btn-outline-info" type="submit">Sign In</button>
                    </form>
                </div>
            </div>
        </nav>
        <div class="container">
            <p id="content">Please Sign In to see your tasks!</p>
        </div>
    </body>
`
export function loadMainPage(app) {
    document.querySelector("#global__content").innerHTML = mainPage; 
    const loginForm = document.querySelector("#app-login-form");
    loginForm.addEventListener("submit", function (e) { 
        e.preventDefault();
       
        const formData = new FormData(loginForm);
        const login = formData.get("login");
        const password = formData.get("password");
        if(!searchUserInLocalStorage(login, password) ){
            window.alert('Такого пользователя не существует! Для того, чтобы начать пользоваться введите login: admin, password: admin')

        }
        addCurrentUser(login, password);
        changeState(); 
        startApp();
    });
}