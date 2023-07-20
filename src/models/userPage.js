import {
    Tasks
} from "./tasksBlocks";
import userPage from "../templates/taskField.html"
import {
    Footer
} from "./footer";
import {
    getFromStorage
} from "../utils";
export class UserPage {
    constructor(appStateCurrentUser, number, kanban) {
        this.tasksBlocks = []
        this.allTasks = []
        this.draggedItem = null
        this.droppedItem = null

        this.statusNames = ['Ready', 'InProgress', 'Finished'];
        this.appStateCurrentUser = appStateCurrentUser
        this.userId = appStateCurrentUser.id
        this.content = document.createElement('div');
        this.content.id = `kanban__content--${this.userId}`
        this.content.className = 'kanban__content row d-flex justify-content-between align-items-center align-items-md-start flex-column flex-md-row'
        this.userName = appStateCurrentUser.login
        this.htmlUserName
        this.number = number
        this.kanban = kanban

    }


    createTasksBlocks(appStateCurrentUser) {
        this.kanban.appendChild(this.content)
        this.statusNames.forEach((element, index) => {
            this.tasksBlocks[index] = new Tasks(element, index, this)
            this.tasksBlocks[index].renderTasks()

        });

        this.renderRelevantTasks(appStateCurrentUser)
    }

    renderRelevantTasks(appStateCurrentUser) {
        const footer = new Footer 
        let allRelevantTasks = getFromStorage('tasks'); 
        let allRelevantTasksOfCurrentUser = [] 

        allRelevantTasks.forEach((element) => { 
            if (this.currentUser()) {
                allRelevantTasksOfCurrentUser.push(element);
            } else {
                if (element.userId == appStateCurrentUser.id) {
                    allRelevantTasksOfCurrentUser.push(element);
                }
            }
        })
        
        for (let i = 0; i < allRelevantTasksOfCurrentUser.length; i++) { 
            if (allRelevantTasksOfCurrentUser[i].status == this.tasksBlocks[0].status) { 
                this.createAndDeleteTask(allRelevantTasksOfCurrentUser[i], this.tasksBlocks[0])
            } else if (allRelevantTasksOfCurrentUser[i].status == this.tasksBlocks[1].status) {
                this.createAndDeleteTask(allRelevantTasksOfCurrentUser[i], this.tasksBlocks[1])
            } else if (allRelevantTasksOfCurrentUser[i].status == this.tasksBlocks[2].status) {
                this.createAndDeleteTask(allRelevantTasksOfCurrentUser[i], this.tasksBlocks[2])
            }
        }

        this.allAddCardDisplay()
        footer.footerContent() 
    }

    allAddCardDisplay(){
        this.tasksBlocks.forEach((element) => {
            element.addCardDisable()
        })
    }

    createAndDeleteTask(oldTask, otherBlock) {
        otherBlock.createTask(oldTask.id)
        let thisTask = otherBlock.tasks[otherBlock.tasks.length - 1];
        otherBlock.renderTransitionTask(oldTask, thisTask);
        otherBlock.addCardDisplay();
        if (oldTask.div) oldTask.deleteTask();
        thisTask.saveTask()
        this.tasksBlocks.forEach((element) => {
            element.actualityDataItem()
        })
    }

    renderUserPage() {
        this.htmlUserName = document.getElementsByClassName('user__name')[0]
        this.htmlUserName.textContent = `${this.userName}`
    }

    addCard(status) {
        if (status == 'Ready') {
            this.tasksBlocks[0].addCardDisplay();
        } else if (status == 'InProgress') {
            this.tasksBlocks[1].addCardDisplay();
        } else if (status == 'Finished') {
            this.tasksBlocks[2].addCardDisplay();
        }

    }

    allInputInP() {
        this.tasksBlocks[0].inputP();
    }


    clicky() {
        document.addEventListener('change', () => {
            this.tasksBlocks.forEach((element) => {

            })
        })
    }

    currentUser() { 
        if (this.appStateCurrentUser) {
            if (this.appStateCurrentUser.login == 'admin' && this.appStateCurrentUser.password == 'admin') {
                return true
            } else {
                return false
            }
        }
    }


}