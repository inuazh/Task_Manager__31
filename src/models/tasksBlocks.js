import {
    Task
} from './task.js';
import {
    footer,
    startApp
} from '../app.js';

import {
    Sortable
} from 'sortablejs';

export const statusNames = ['Ready', 'InProgress', 'Finished'];
const divWidth = Math.round((12 / statusNames.length) - 1);
export class Tasks {
    
    constructor(status, dataZoneNumber, userPageObject) {
        this.status = status;
        this.dataZoneNumber = dataZoneNumber;
        this.tasks = [];
        this.usersId = userPageObject.userId
        this.counter = this.tasks.length;
        this.dropDownFlag = false
        this.userPage = userPageObject

        this.kanbanContent = this.userPage.content
        this.title = document.createElement('h3')

        this.tasksCardsDiv = document.createElement('div') 
        this.tasksCardsDiv.className = `dropZone dropZone--${this.usersId} ${status}__task--cards`
        this.tasksCardsDiv.setAttribute('data-zone', this.dataZoneNumber);
        this.submitAddCard = document.createElement('input')
        this.submit = document.createElement('input');
        this.submit.type = 'submit';
        this.submit.className = 'task__add--button btn btn-primary';
        this.submit.value = 'submit';
        this.title.innerText = status;
        this.submitAddCard.type = 'submit';
        this.submitAddCard.id = `${status}__add--button`;
        this.submitAddCard.className = `${status}__add--button`;
        this.submitAddCard.value = "+Add card";
        this.flag = false;

        this.div = document.createElement('div');
        this.div.className = `kanban__block kanban__${this.status} col-md-${divWidth} d-flex justify-content-start flex-column`
        this.div.id = `kanban__${this.status}`

        this.sortable = Sortable.create(this.tasksCardsDiv, {
            group: `tasks-sortable`,
            sort: true,
            animation: 150,
            dataIdAttr: 'data-id',
            selectedClass : " sortable-selected ",
            ghostClass: 'ghost',

            store: {
                                get: function (sortable) {
                    var order = localStorage.getItem(sortable.options.group.name);
                    return order ? order.split('|') : [];
                },

                                set: function (sortable) {
                    var order = sortable.toArray();
                    localStorage.setItem(sortable.options.group.name, order.join('|'));
                },
            },

            onEnd: function (evt) {   
                let counter = 0
                evt.from.childNodes.forEach((element) => {
                    if (element.getAttribute('data-item')) {
                        element.setAttribute('data-item', counter)
                        counter++
                    }
                })

                counter = 0
                
                if (evt.to > 0) {
                    evt.to.forEach((element) => {
                        if (element.getAttribute('data-item')) {
                            element.setAttribute('data-item', counter)
                            counter++                
                        }
                        counter = 0
                    })
                }


        
                userPageObject.tasksBlocks.forEach((element) => {
                    element.tasks.forEach((el, index) => {
                        el.number = Number(el.div.getAttribute('data-item')) 
             
                    })
                })

                userPageObject.tasksBlocks.forEach((element) => {
                    let sortedArray = element.tasks.sort(function (a, b) {
                        return a.number - b.number; 
                    });
                })

                userPageObject.tasksBlocks.forEach((element) => {
                    element.tasks.forEach((el) => {
                        el.saveTask()
                    })
                })
                footer.footerContent();
            },
 
 
 
            onSort: function (evt) {
                userPageObject.tasksBlocks.forEach((element) => { 
                    element.tasks.forEach((el) => { 
                        if (el.div.parentElement.getAttribute('data-zone') != el.block().dataZoneNumber) { 
                            el.status = userPageObject.tasksBlocks[evt.to.getAttribute('data-zone')].status 
                        } else {                          
                        }
                    })
                })
            },
        });

        this.kanbanContent.appendChild(this.div)
        this.dropDown = document.createElement('select');
        this.dropDown.className = 'form-select';
        this.dropDown.setAttribute('aria-label', 'Выберите задачу')
        this.dropDown.style.display = 'none';
    };

    renderTasks() { 
        if (this.div) {
            this.div.appendChild(this.title);
            this.div.appendChild(this.tasksCardsDiv);
            this.div.appendChild(this.submitAddCard);
            this.div.appendChild(this.dropDown);
            this.addTask();
        }
    };

    addCardDisplay() { 
        if (!this.flag) {
            this.submitAddCard.style.display = 'none';
            this.flag = true;
        } else {
            this.submitAddCard.style.display = 'block';
            this.flag = false;         
        }
    }

    addCardDisable(){
        if(this.status != 'Ready'){  
            if(this.userPage.tasksBlocks[this.dataZoneNumber - 1].tasks.length < 1){
                this.submitAddCard.setAttribute('disabled', true)
            }else{
                this.submitAddCard.removeAttribute('disabled')
            }
        }      
    }



    createTask(id) { 
        let task = new Task(this.status, this.counter - 1, this.userPage); 
        this.tasks.push(task); 
        this.counter = this.tasks.length; 
        task.div.setAttribute('data-item', this.tasks.length - 1) 
        task.setUserId(this.userPage.userId); 
        if (id) {
            task.id = id
        }
        task.number = Number(task.div.getAttribute('data-item')) 
        task.p.addEventListener('click', () => { 
            this.addCardDisplay();
        })
        return task
    }

    renderCreatedTask() {
        this.tasks[this.tasks.length - 1].renderTask(this.tasksCardsDiv); 
        let inputEvent = new Event("focusin");
        this.tasks[this.tasks.length - 1].input.dispatchEvent(inputEvent);

    }

    renderTransitionTask(oldTask, newTask) { 
        this.tasksCardsDiv.appendChild(newTask.div) 
        newTask.taskValue(oldTask.value) 
        newTask.setUserId(oldTask.userId) 
        newTask.number = this.tasks.length - 1 
        newTask.status = this.status 
        newTask.renderTask(this.tasksCardsDiv) 

        let event = new Event("click");
        newTask.p.dispatchEvent(event); 
        newTask.submit.dispatchEvent(event);
    }


    addTask() {
        if (this.status != 'Ready') {
            this.submitAddCard.addEventListener('click', () => {
                this.submitAddCard.parentNode.replaceChild(this.dropDown, this.submitAddCard)
                this.dropDownContent();
            })

        } else {
            this.submitAddCard.addEventListener('click', () => {
                this.addCardDisplay();
                this.createTask()
                this.renderCreatedTask();
            })

        }
    }

    dropDownContent() {
        const draggingFromBlock = this.userPage.tasksBlocks[this.dataZoneNumber - 1]; 
        this.dropDown.style.display = 'inline-block'; 
        let firstOption = document.createElement('option'); 
        firstOption.setAttribute('selected', 'true') 
        firstOption.innerText = 'выберите задачу'; 
        this.dropDown.appendChild(firstOption) 


        draggingFromBlock.tasks.forEach((element) => { 
            let option = document.createElement('option'); 
            option.className = 'option' 
            option.value = element.div.getAttribute('data-item'); 
            option.innerText = element.value;
            this.dropDown.appendChild(option) 

        })

        let allOptions = document.querySelectorAll('.option'); 
        this.dropDown.addEventListener('change', (e) => { 
            e.preventDefault() 
            if (!this.dropDownFlag) {

                this.dropDownFlag = true
                let foundTask
                for (let i = 0; i < allOptions.length; i++) {
                    if (allOptions[i].selected) { 
                        foundTask = draggingFromBlock.tasks[i] 
                        
                    }
                }
                this.userPage.createAndDeleteTask(foundTask, this.userPage.tasksBlocks[this.dataZoneNumber])
                this.dropDown.style.display = 'none';
                this.dropDown.parentNode.replaceChild(this.submitAddCard, this.dropDown)
                allOptions.forEach(e => {
                    e.selected = false
                    e.remove()
                });
                firstOption.remove()
                this.dropDownFlag = false
            }
            startApp()
        })
    }





    inputP() {
        for (let i = 0; i < this.tasks.length; i++) { 
            this.tasks[i].input.replaceWith(this.tasks[i].p);
            this.tasks[i].submit.style.display = 'none';
            this.tasks[i].submitDelete.style.display = 'none';
            this.tasks[i].divSubmits.style.display = 'none';
        }
    }


    actualityDataItem() {
        this.tasks.forEach((element, index) => {
            element.div.setAttribute('data-item', index)
            element.number = index
        })
    }


    setUsersId(appState) {
        if (!this.usersId) {
            this.usersId = appState.currentUser.id;
        }
    }

}