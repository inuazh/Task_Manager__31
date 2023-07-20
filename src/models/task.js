
import {
    addToStorage,
    getFromStorage
} from "../utils.js";
import {
    BaseModel
} from "./BaseModel.js";

export class Task extends BaseModel {
    constructor(status, number, userPageObject) {
        super();
        this.number = number;
        this.status = status;
        this.value = '';
        this.userId = userPageObject.userId
        this.userPage = userPageObject
        this.form = document.createElement('form'); 
        this.p = document.createElement('p');
        this.input = document.createElement('input');
        this.submit = document.createElement('input');
        this.div = document.createElement('div');
        this.submitDelete = document.createElement('button') 
        this.divSubmits = document.createElement('div');

        this.input.className = 'card';
        this.submit.type = 'submit';
        this.submit.style.display = 'none'
        this.submit.className = 'task__add--button btn btn-primary';
        this.submit.value = 'submit';

        this.submitDelete.style.display = 'none'
        this.submitDelete.className = 'task__add--button btn btn-danger';
        this.submitDelete.innerText = 'удалить';

        this.divSubmits.className = 'divSubmits'
        this.divSubmits.style.display = 'none'

        this.div.draggable = true;
        this.div.className = 'draggable-item'
    }


    renderTask(element) { 
        element.appendChild(this.div);
        this.div.appendChild(this.form);
        this.form.appendChild(this.input);
        this.form.appendChild(this.divSubmits);
        this.divSubmits.appendChild(this.submit);
        this.divSubmits.appendChild(this.submitDelete);

        this.input.focus()

        this.input.addEventListener('focusin', () => {
            this.divSubmits.style.display = 'flex';
            this.submitDelete.style.display = 'block';
            this.submit.style.display = 'block';

            this.submit.addEventListener('click', (e) => {
                if (this.input.value != '') {
                    e.preventDefault();
                    this.taskValue(this.input.value);
                    this.input.replaceWith(this.p);
                    this.divSubmits.style.display = 'none';
                    this.submitDelete.style.display = 'none';
                    this.submit.style.display = 'none'
                    this.userPage.addCard(this.status);
                }

            })

        })

        
        
        

        this.input.addEventListener('drag', (event) => {
        }, false)

        this.submitDelete.addEventListener('click', (e) => {
            e.preventDefault()
            this.deleteTask()
            this.block().addCardDisplay()

        })

        this.p.addEventListener('click', () => {
            this.userPage.allInputInP();
            this.p.replaceWith(this.input);
            this.div.parentElement.appendChild(this.divSubmits);
            this.divSubmits.appendChild(this.submit);
            this.divSubmits.appendChild(this.submitDelete);
            this.divSubmits.style.display = 'flex';
            this.submitDelete.style.display = 'block';

            this.submit.style.display = 'block';
            this.submit.addEventListener('click', () => {
                this.taskValue(this.input.value);
                this.input.replaceWith(this.p);
                this.divSubmits.style.display = 'none';
                this.submitDelete.style.display = 'none';
                this.submit.style.display = 'none'
            })
        })
    }

    taskValue(value) {
        this.p.innerText = value;
        this.input.value = value;
        this.value = value;
        this.saveTask()
    }

    deleteTask() {
        let block = this.block();
        let tasksFromLocal = getFromStorage('tasks')
        block.tasks.splice(this.number, 1)
        for (let i = 0; i < tasksFromLocal.length; i++) {
            if (tasksFromLocal[i].id == this.id) {
                tasksFromLocal.splice(i, 1)
            }
        }

        function updateNumbers(array) {
            array.forEach((element, index) => {
                if (array == block.tasks) {
                    element.div.setAttribute('data-item', index)
                }
                element.number = index
            })
        }

        updateNumbers(tasksFromLocal)
        block.counter--;

        this.div.remove();
        this.form.remove()
        this.p.remove()
        this.input.remove()
        this.divSubmits.remove()
        this.submitDelete.remove()

        localStorage.removeItem('tasks');
        tasksFromLocal.forEach((element) => {
            addToStorage(element, 'tasks')
        })
        this.userPage.allAddCardDisplay()
    }


    transferTask(element) {
        this.div = element.div
    }

    setUserId(userId) {
        this.userId = userId;
    }

    block() {
        let block
        this.userPage.tasksBlocks.forEach((element) => {
            if (element.status == this.status) {
                block = element
            }
        })
        return block
    }


    saveTask() {
        if (this.value) {
            let task = { 
                'id': this.id,
                'number': this.number,
                'status': this.status,
                'value': this.value,
                'userId': this.userId,
            }

            let allTasksFromLocalStorage = getFromStorage('tasks'); 
            let allId = []; 
            function searchID(element) { 
                return element == task.id
            }

            if (allTasksFromLocalStorage.length > 0) { 
                for (let i = 0; i < allTasksFromLocalStorage.length; i++) { 
                    allId[i] = allTasksFromLocalStorage[i].id; 
                }
                if (allId.some(searchID)) { 
                    for (let j = 0; j < allTasksFromLocalStorage.length; j++) { 
                        if (allTasksFromLocalStorage[j].id == this.id) { 
                            allTasksFromLocalStorage.splice(j, 1, task) 
                        }
                    }
                } else { 
                    allTasksFromLocalStorage[allTasksFromLocalStorage.length] = task; 
                }
            } else { 
                allTasksFromLocalStorage[0] = task; 
            }


            allTasksFromLocalStorage.sort(function (a, b) {
                return a.number - b.number; 
            });
            localStorage.removeItem('tasks');
            allTasksFromLocalStorage.forEach((element) => {
                addToStorage(element, 'tasks')
            })
        }

        this.userPage.allAddCardDisplay()
    }

}