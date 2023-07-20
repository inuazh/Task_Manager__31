import {
    appState
} from "../app"
import {
    getFromStorage
} from "../utils"

export class Footer {
    constructor() {
        this.footer = document.createElement('footer')
        this.body = document.getElementsByTagName('body')[0]
        this.existFooter = document.getElementsByTagName('footer')
    }
    currentUser() {
        if (appState.currentUser) {
            if (appState.currentUser.login == 'admin' && appState.currentUser.password == 'admin') {
                return true
            } else {
                return false
            }
        }
    }

    footerContent() {
        if (appState.currentUser) {
            if (this.currentUser()) {

                this.footer.className = ''
                this.footer.innerHTML = `
                <div class="footer__container container-fluid">
                    <div class="footer__row row d-flex flex-row justify-content-md-between ">
                            <div class="admin__footer__allUsers__block           col-xlg-10 col-lg-6 col-md-5 col-sm-">
                                <p id="admin__footer__allUsers__text" class="admin__footer__allUsers__text">Количество зарегестрированных пользователей: ${this.qualityOfRegistrationUsers()}</p>
                            </div>
                            <div class="admin__footer__allInProgressTasks__block col-xlg-1 col-lg-3 col-md-4 col-sm-12">
                                <p id="admin__footer__allInProgressTasks__text" class="admin__footer__allInProgressTasks__text ">Количество задач в работе: ${this.getInProcessTasksFromLocalStorage()} </p>
                            </div>
                            <div class="admin__footer__allFinishedTasks__block   col-xlg-1 col-lg-3 col-md-3 col-sm-12 ">
                                <p id="admin__footer__allFinishedTasks__text" class="admin__footer__allFinishedTasks__text">Количество завершенных задач: ${this.getFinishedTasksFromLocalStorage()} </p>
                            </div>
                    </div>
                </div>
                `

            } else {

                this.footer.className = 'user__footer'
                this.footer.innerHTML = `
                <div class="footer__container container-fluid">
                    <div class="footer__row row d-flex flex-row justify-content-md-between ">
                        <div class="admin__footer__allInProgressTasks__block col-xlg-1 col-lg-3 col-md-4 col-sm-12">
                            <p id="user__footer__duringTasks" class="admin__footer__allInProgressTasks__text ">Количество задач в работе: ${this.getInProcessTasksFromLocalStorage()} </p>
                        </div>
                        <div class="admin__footer__allInProgressTasks__block col-xlg-1 col-lg-3 col-md-4 col-sm-12">
                            <p id="user__footer__completedTasks" class="admin__footer__allInProgressTasks__text ">Количество завершённых задач:${this. getFinishedTasksFromLocalStorage()} </p>
                        </div>
                        <div class="admin__footer__allFinishedTasks__block   col-xlg-1 col-lg-3 col-md-3 col-sm-12 ">
                            <p class="admin__footer__allFinishedTasks__text">Kanban Board by <span class="user__name">${appState.currentUser.login}</span>  </p>
                        </div>
                    </div>
                </div>
            `
            }

            if (this.checkExistFooter()) {
                this.existFooter[0].remove()
                this.body.appendChild(this.footer)
            } else {

                this.body.appendChild(this.footer)
            }
        }

    }

    checkExistFooter() {
        if (this.existFooter.length > 0) {
            return true
        } else {
            return false
        }
    }
    getInProcessTasksFromLocalStorage() {
        let counter = 0
        let tasks = getFromStorage('tasks')
        if (this.currentUser()) {
            tasks.forEach(element => {
                if (element.status == 'Ready' || element.status == 'InProgress') {
                    counter++
                }
            });
        } else {
            tasks.forEach(element => {
                if (element.userId == appState.currentUser.id) {
                    if (element.status == 'Ready' || element.status == 'InProgress') {
                        counter++
                    }
                }
            })
        }

        return counter
    }

    getFinishedTasksFromLocalStorage() {
        let counter = 0
        let tasks = getFromStorage('tasks')
        if (this.currentUser()) {
            tasks.forEach(element => {
                if (element.status == 'Finished') {
                    counter++
                }
            });

        } else {
            tasks.forEach(element => {
                if (element.userId == appState.currentUser.id) {
                    if (element.status == 'Finished') {
                        counter++
                    }
                }
            })
        }

        return counter
    }

    qualityOfRegistrationUsers() {
        const users = getFromStorage('users')
        const quantity = users.length
        return quantity
    }

    startFooter() {
        window.addEventListener('load', () => {
            this.footerContent()
            document.addEventListener('click', () => {
                this.footerContent()
            })
        })
    }
}