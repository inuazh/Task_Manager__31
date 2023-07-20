import userPage from "../templates/taskField.html";
import { appState } from "../app.js";
import { UserPage } from "../models/userPage.js";

export let userPageObject

export function userLoader() {
    document.querySelector('#global__content').innerHTML = userPage;
    
    let kanban = document.getElementsByClassName('kanban')[0]
    userPageObject = new UserPage(appState.currentUser, 0, kanban)
    userPageObject.renderUserPage()
    userPageObject.createTasksBlocks(appState.currentUser)


}

