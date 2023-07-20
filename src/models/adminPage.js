
import {
    changeCurrentUserInLocalStorage,
    generateUser,
    getFromStorage
} from "../utils";
import {
    appState,
    footer
} from "../app";
import {
    User
} from "./User";
import {
    UserPage
} from "./userPage";





export class AdminPage {
    constructor(adminWrapper, dropdown) {
        this.adminWrapper = adminWrapper
        this.dropDownMenu = dropdown
        this.userPages = []
        this.dropDownUsersBtn = document.createElement('li');
        this.dropDownTasksBtn = document.createElement('li');
        this.dropDownUsersBtn.innerHTML = `
        <a class="dropdown-item" href="#">
        <p id="admin__allUsers__btn" class="admin__left__menu__users d-flex">Пользователи</p>
        </a>
        `
        this.dropDownTasksBtn.innerHTML = `
        <a class="dropdown-item" href="#">
        <p id="admin__allTasks__btn" class="admin__left__menu__tasks d-flex">Задачи</p>
        </a>
        `

        this.form = document.createElement('form')
        this.form.id = 'admin-form'
        this.form.className = 'admin-form'
        this.form.innerHTML = `
            <h3>Форма для регистрации и удаления пользователей</h3>
            <div class="row mb-1 d-flex flex-row">
                <label for="#admin-form" class="admin-form__label col-xs-12 col-lg-4"> <input
                        id="admin__form__input__login" class="form-control " name="login"
                        autocomplete="username" type="text" placeholder="Login" aria-label="Login"></label>
                <label for="#admin-form" class="admin-form__label col-xs-12 col-lg-4"><input
                        id="admin__form__input__password" class="form-control me-2" name="password"
                        autocomplete="current-password" type="password" placeholder="Password"
                        aria-label="Password"></label>
                <button id="registr-btn"
                    class="admin__form__addUser__btn btn btn-light col-xs-12 col-lg-4"
                    type="submit">Зарегистрировать
                    пользователя</button>
            </div>
        `

        this.formTable = document.createElement('table')
        this.formTable.className = 'table';
        this.formTable.innerHTML =
            `
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Login</th>
                    <th scope="col">Password</th>
                    <th scope="col">Delete</th>
                </tr>
            </thead>
            
        `

        this.tableBody = document.createElement('tbody')
        this.tableBody.id = 'admin__usersTable__body'
        this.formTable.appendChild(this.tableBody)
    }

    dropdownContent() {
        this.dropDownMenu.appendChild(this.dropDownUsersBtn)
        this.dropDownMenu.appendChild(this.dropDownTasksBtn)

        this.dropDownUsersBtn.addEventListener('click', () => {
            this.dropdownUserBtnAction()
            changeCurrentUserInLocalStorage(appState.currentUser, false) 
            
        })
        this.dropDownTasksBtn.addEventListener('click', () => {
            this.dropDownTasksBtnAction()
            changeCurrentUserInLocalStorage(appState.currentUser, true)   
        })
    }

    dropdownUserBtnAction() {
        this.createUsersMenu()
    }

    dropDownTasksBtnAction() {
        this.createTasksMenu()  
    }

    createUsersMenu() {
        this.adminWrapper.innerHTML = ''
        this.adminWrapper.appendChild(this.form)
        this.adminWrapper.appendChild(this.formTable)
        this.showAllUsers()
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.registrationNewUser()
            this.showAllUsers();
        })
        this.pageFlag = false
    }
    createTasksMenu() {
        const tasksMenu = document.createElement('div')
        tasksMenu.className = 'kanban'
        this.adminWrapper.innerHTML = ''
        this.adminWrapper.appendChild(tasksMenu)

        let users = getFromStorage('users')
        users.forEach((element, index) => {
            let nameOfUser = []
            nameOfUser[index] = document.createElement('h2')
            nameOfUser[index].innerText = element.login
            tasksMenu.appendChild(nameOfUser[index])
            this.userPages[index] = new UserPage(element, index, tasksMenu)
            this.userPages[index].createTasksBlocks(element)
        })
        this.pageFlag = true
    }

    createTable(number, login, password) {
        const formTableTr = document.createElement('tr')
        formTableTr.className = 'admin__table__allDataOfUser'
        formTableTr.innerHTML = `
        <th class="admin__table__numberOfUser" scope="row">${number}</th>
        <td class="admin__table__loginOfUser">${login}</td>
        <td class="admin__table__passwordOfUser">${password}</td>
        <td><input id="admin__registredusers__btn__delete--${number}" class="admin__registredusers__btn__delete btn btn-dark btn-sm col-sm-6 col-md-5 col-lg-4" type="button" value="Удалить"></td>
        `
        this.tableBody.appendChild(formTableTr)
        const adminDeleteUserBtn = document.getElementById(`admin__registredusers__btn__delete--${number}`);
        adminDeleteUserBtn.addEventListener('click', () => {
            window.alert('btn_delete')
            this.deleteUser(number)
        })
    }

    showAllUsers() {
        this.tableBody.innerHTML = ''
        const users = getFromStorage('users')
        const adminDeleteUserBtns = document.getElementsByClassName(`admin__registredusers__btn__delete`);
        users.forEach((element, index) => {
            this.createTable(index + 1, element.login, element.password)
            if (element.id == appState.currentUser.id) {
                adminDeleteUserBtns[index].setAttribute('disabled', true);
            }
        })
        footer.footerContent()
    }

    deleteUser(number) {
        let users = getFromStorage('users')
        users.splice([number - 1], 1)
        localStorage.removeItem('users')
        localStorage.setItem('users', JSON.stringify(users))
        this.showAllUsers()
    }

    registrationNewUser() {
        const formData = new FormData(this.form);
        const login = formData.get("login");
        const password = formData.get("password");
        const inputLogin = document.querySelector('#admin__form__input__login')
        const inputPassword = document.querySelector('#admin__form__input__password')

        if (this.existUser(login, password) == false) { 
            generateUser(User, login, password);
        }
        inputLogin.value = ''
        inputPassword.value = ''
    }

    existUser(login, password) { 
        let existUser = false;
        let users = getFromStorage('users');
        users.forEach(element => {
            if (element.login == login && element.password == password) {
                window.alert('такой пользователь уже существует!')
                existUser = true;
            }
        });
        return existUser;
    }
}





























