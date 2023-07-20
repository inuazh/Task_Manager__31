import '../index.html'
import admin from "../templates/admin.html"
import { appState } from '../app';
import { AdminPage } from '../models/adminPage';

export function loadAdminPage() {
    const globalContent = document.getElementById('global__content')
    globalContent.innerHTML = admin
    const adminDropdown = document.getElementById('dropdown-menu')
    const adminWrapper = document.getElementById('admin__wrapper')
    createAdminPage(adminWrapper, adminDropdown)
}


function createAdminPage(adminWrapper, dropdown) {
    let adminPage = new AdminPage(adminWrapper, dropdown)    
    adminPage.dropdownContent()
    if (appState.currentUser.dropDownFlag == false) {
        adminPage.createUsersMenu()
    } else {
        adminPage.createTasksMenu()
    }
    return adminPage
}
