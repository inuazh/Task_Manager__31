import { loadAdminPage } from "./adminPage/adminPageLoader";
import {
  users,
  appState,
  startApp
} from "./app";

import { loadMainPage } from "./mainPage/mainPage";
import { BtnOut } from "./models/btnOut";
import { userLoader } from "./userPage/userLoader";
import { User } from "./models/User";

export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const addToStorageCurrentUser = function (obj, key) { 
  localStorage.removeItem('currentUser');
  const storageDataCurrentUser = getFromStorage(key);
  storageDataCurrentUser.push(obj);
  return localStorage.setItem(key, JSON.stringify(storageDataCurrentUser));
  
};

export const generateTestUser = function (User) {
  localStorage.clear();
  const testUser = new User("test", "qwerty123");
  User.save(testUser);

};
export const generateUser = function (User, login, password) {
  const user = new User(login, password);
  User.save(user);
}

export const generateAdminUser = function (User) {
  const adminUser = new User("admin", "admin");
  User.save(adminUser); 
};




export const addCurrentUser = (login, password) => { 
let users = getFromStorage('users');
  users.forEach(element => { 
    
    if (element.login == login && element.password == password) { 
      addToStorageCurrentUser(element, 'currentUser');
    }
  });

}



export function changeCurrentUserInLocalStorage(user, value){ 
  user.dropDownFlag = value
  addToStorageCurrentUser(user, 'currentUser')

}

export function changeState() { 
  const currentUser = getFromStorage('currentUser'); 
  
  if (currentUser.length != 0) { 
    appState.currentUser = currentUser[0]; 
  }
  else{
  
    appState.currentUser = null; 
  }
  

}


export function createAdminUser() { 
  if (appState.currentUser) { 
    if (appState.currentUser.login == 'admin') { 
      return
    }
  } else { 
    if (users.length > 0) { 
      if (searchUserInLocalStorage('admin', 'admin')) { 
        return
      } else { 
        generateAdminUser(User); 
        return
      }
    } else { 
      generateAdminUser(User); 
      return
    }
  }
}  

export function searchUserInLocalStorage(login, password) { 
  return (users.some(obj => obj.login == login && obj.password == password))
}




export function pageLoader() {
  if (appState.currentUser) {
    if (appState.currentUser.login == 'admin' && appState.currentUser.password == 'admin') {
      
      loadAdminPage()
      const btnOut = new BtnOut()
      btnOut.outElementContent()
    } else {
      
      userLoader();
      const btnOut = new BtnOut()
      btnOut.outElementContent()
    }
  } else {
    loadMainPage(startApp)
  }

}