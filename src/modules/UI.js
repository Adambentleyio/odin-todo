import { format } from 'date-fns'
import Storage from './Storage'
import Project from './Project'
import Task from './Task'

export default class UI {

    // init homepage is the master funciton that calls all the setup for first page load. We than call it after the DOM is loaded in index.js
    // set click handler for form submit in a separate function

    static initHomePage() {
        UI.loadProjects()
        UI.initProjectButtons()
        UI.openProject(document.getElementById('button-inbox-projects'), 'Inbox')
        document.addEventListener('keydown', UI.handleKeyboardInput)
    }

    static loadProjects() {
      Storage.getTodoList()
      .getProjects().
      forEach((project) => {
        if(
          project.name !== 'Inbox' &&
          project.name !== 'Today' &&
          project.name !== 'This week'
        ) {
          UI.createProject(project.name)
        }
      })
      UI.initAddProjectButtons()
    }

    static initProjectButtons(){
        // get a reference to the project buttons in the DOM
        const inboxProjectsButton = document.getElementById('button-inbox-projects')
        const dayProjectsButton = document.getElementById('button-day-projects')
        const weekProjectsButton = document.getElementById('button-week-projects')
        const projectButtons = document.querySelectorAll('[data-project-button]')

        inboxProjectsButton.addEventListener('click', UI.openInboxProjects)
        dayProjectsButton.addEventListener('click', UI.openDayProjects)
        weekProjectsButton.addEventListener('click', UI.openWeekProjects)
        projectButtons.forEach((projectButton) =>
          projectButton.addEventListener('click', () => {
            UI.handleProjectButton()
            UI.openProject(projectButton, UI.getTaskName(projectButton))
          })
          )
    }

    static loadProjectTasks(projectName) {

        const projectPreview = document.getElementById('project-preview')
        projectPreview.innerHTML = ''
        projectPreview.innerHTML = `
        <h1 id="project-name">${projectName}</h1>
        <div class="tasks-list" id="tasks-list"></div>`

        // if project is not today or this week then render the add tasks form

        if (projectName !== 'Today' && projectName !== 'This week') {
            projectPreview.innerHTML += `
              <button class="primary button-add-task" id="button-add-task">
                <i class="fas fa-plus"></i>
                Add Task
              </button>
              <div class="add-task-popup" id="add-task-popup">
                <input
                  class="input-add-task-popup"
                  id="input-add-task-popup"
                  type="text"
                  placeholder="Task name"
                />
                <input
                  class="input-add-task-popup"
                  id="input-add-task-description-popup"
                  type="text"
                  placeholder="Description"
                />
                <div class="add-task-popup-buttons">
                  <button class="primary" id="button-add-task-popup">
                    Add
                  </button>
                  <button
                    class="secondary"
                    id="button-cancel-task-popup"
                  >
                    Cancel
                  </button>
                </div>
              </div>`
          }

       UI.loadTasks(projectName)
    }

    // load the inbox project content

    static openInboxProjects() {
        UI.openProject(this, 'Inbox')
    }
    static openDayProjects() {
        Storage.updateTodayProject()
        UI.openProject(this, 'Today')
    }
    static openWeekProjects() {
        Storage.updateWeekProject()
        UI.openProject(this, 'This week')
    }

    static openProject(projectButton, projectName) {
      console.log("open")
        // remove the active class from all project buttons
        const defaultProjectButtons = document.querySelectorAll('.default-project-button')
        defaultProjectButtons.forEach(button => {
            button.classList.remove('active')
        })
        projectButton.classList.add('active')

        // call the load tasks function
        UI.loadProjectTasks(projectName)
    }

    static handleProjectButton(e) {
      // const projectName = UI.getTaskName(this)
      if (e.target.classList.contains('fa-times')) {
        console.log("handle project button")
        // Storage.deleteProject(projectName)
      }
    }

    // GET UI INFORMATION

    static getProjectName() {
      return document.getElementById('project-name').textContent
    }

    static getTaskName(taskButton) {
      return taskButton.children[0].children[1].textContent
    }


    // CREATING DOM CONTENT

    static createProject(name) {
      const userProjects = document.getElementById('projects-list')
      userProjects.innerHTML += `
        <button class="button-project" data-project-button>
          <div class="left-project-panel">
            <i class="fas fa-tasks"></i>
            <span>${name}</span>
          </div>
          <div class="right-project-panel">
            <i class="fas fa-times"></i>
          </div>
        </button>`
      UI.initProjectButtons()
      UI.initAddProjectButtons()
    }

    static createTask(name, dueDate, description, priority) {
        const tasksList = document.getElementById('tasks-list')
        tasksList.innerHTML += `
        <button class="button-task" data-task-button>
          <div class="left-task-panel">
            <i class="far fa-circle"></i>
            <p class="task-content">${name}</p>
            <input type="text" class="input-task-name" data-input-task-name>
          </div>
          <div class="right-task-panel">
            <p class="due-date" id="due-date">${dueDate}</p>
            <input type="date" id="input-due-date" class="input-due-date" data-input-due-date>
            <p class="description" id="description">${description ? description : ''}</p>
            <i class="fas fa-times"></i>
          </div>
        </button>`

        UI.initTaskButtons()

    }

    static loadTasks(projectName) {

      Storage.getTodoList()
          .getProject(projectName)
          .getTasks()
          .forEach((task) => UI.createTask(task.name, task.dueDate, task.description))

        if (projectName !== 'Today' && projectName !== 'This week') {
          UI.initAddTaskButtons()
        }
        UI.initTaskButtons()
      }

    static clearTasks() {
        const tasksList = document.getElementById('tasks-list')
        tasksList.textContent = ''
      }

      static closeAllPopups() {
        UI.closeAddProjectPopup()
        if (document.getElementById('button-add-task')) {
          UI.closeAddTaskPopup()
        }
        if (
          document.getElementById('tasks-list') &&
          document.getElementById('tasks-list').innerHTML !== ''
        ) {
          UI.closeAllInputs()
        }
      }

      static closeAllInputs() {
        const taskButtons = document.querySelectorAll('[data-task-button]')

        taskButtons.forEach((button) => {
          UI.closeRenameInput(button)
          UI.closeDateInput(button)
        })
      }


    // TASK EVENT LISTENERS

    static handleKeyboardInput(e) {
      if (e.key === 'Escape') UI.closeAllPopups()
    }

    static initAddTaskButtons() {
      const addTaskButton = document.getElementById('button-add-task')
      const addTaskInput = document.getElementById('input-add-task-popup')
      const addTaskButtonAdd = document.getElementById('button-add-task-popup')
      const addTaskButtonCancel = document.getElementById('button-cancel-task-popup')
      const taskDueDate = document.getElementById('input-due-date')

      addTaskButton.addEventListener('click', UI.openAddTaskPopup)
      addTaskInput.addEventListener('keypress', UI.handleAddTaskInput)
      addTaskButtonCancel.addEventListener('click', UI.closeAddTaskPopup)
      addTaskButtonAdd.addEventListener('click', UI.addTask)

    }

    static openAddTaskPopup() {
      const addTaskPopup = document.getElementById('add-task-popup')
      const buttonAddTask = document.getElementById('button-add-task')
      addTaskPopup.classList.add('active')
      buttonAddTask.classList.add('active')
    }

    static closeAddTaskPopup() {
      const addTaskPopup = document.getElementById('add-task-popup')
      const addTaskButton = document.getElementById('button-add-task')
      const addTaskInput = document.getElementById('input-add-task-popup')
      const addTaskInputDesc = document.getElementById('input-add-task-description-popup')

    addTaskPopup.classList.remove('active')
    addTaskButton.classList.remove('active')
    addTaskInput.value = ''
    addTaskInputDesc.value = ''
    }

    static handleAddTaskInput(e) {
      if (e.key == 'Enter') {
        UI.addTask()
      }
    }

    static addTask() {
      // if input is empty
      const addTaskInput = document.getElementById('input-add-task-popup')
      const addTaskInputDescription = document.getElementById('input-add-task-description-popup')
      const taskName = addTaskInput.value
      const taskDesc = addTaskInputDescription.value

      if (taskName === '') {
        alert("Task name can't be empty")
        return
      }

      // if project list has duplicate task name
      const projectName = document.getElementById('project-name').textContent

      if (Storage.getTodoList().getProject(projectName).contains(taskName)) {
        alert('Task names must be different')
        return
      }

      // else add task to storage
      Storage.addTask(projectName, new Task(taskName, taskDesc))
      UI.createTask(taskName, 'No date', taskDesc )
      UI.closeAddTaskPopup()
    }

    static handleDateInput(e) {
      console.log(e)
      if (e.key == 'Escape') {
        console.log("close date input")
        UI.closeDateInput(this)
      }
    }

    static handleTaskButton(e) {

      // if e.target is fa-circle setTaskCompleted
      if (e.target.classList.contains('fa-circle')) {
        console.log('circle')
        UI.setTaskCompleted(this)
        return
      }

      // if e.target is fa-times deleteTask

      if (e.target.classList.contains('fa-times')) {
        UI.deleteTask(this)
        return
      }

      if (e.target.classList.contains('task-content')) {
        UI.openRenameInput(this)
        return
      }

      if (e.target.classList.contains('due-date')) {
        UI.openDueDateInput(this)

      }

    }

    static deleteTask(taskButton) {
      // get task name from task button
      const taskName = taskButton.children[0].children[1].innerText

      // get project name from project name
      const projectName = document.getElementById('project-name').textContent

      // remove task from storage
      Storage.deleteTask(projectName, taskName)

      // render tasks again
      UI.clearTasks()
      UI.loadTasks(projectName)
    }

    static setTaskCompleted(taskButton) {
      // get task name from task button
      const taskName = taskButton.children[0].children[1].innerText

      // get project name from project name
      const projectName = document.getElementById('project-name').textContent

      // remove task from storage
      Storage.deleteTask(projectName, taskName)

      // render tasks again
      UI.clearTasks()
      UI.loadTasks(projectName)
    }

    static initTaskButtons() {
        const taskButtons = document.querySelectorAll('[data-task-button]')
        const taskNameInputs = document.querySelectorAll('[data-input-task-name]')
        const dueDateInputs = document.querySelectorAll('[data-input-due-date]')

      taskButtons.forEach((taskButton) =>
      taskButton.addEventListener('click', UI.handleTaskButton)
    )
    taskNameInputs.forEach((taskNameInput) =>{
      taskNameInput.addEventListener('keypress', UI.renameTask)

      taskNameInput.addEventListener('blur', function(event) {
        event.stopPropagation()
        if (event.target.classList.contains('active')) {
          UI.closeRenameInput(this.parentNode.parentNode)
        }
      })
    })

    dueDateInputs.forEach((dueDateInput) =>{
      dueDateInput.addEventListener('change', UI.setTaskDate)
    }
    )

  }


  static openRenameInput(taskButton) {
    const taskNamePara = taskButton.children[0].children[1]
    const taskNameInput = taskButton.children[0].children[2]
    let taskName = taskButton.children[0].children[1].textContent
    taskNamePara.classList.add('active')
    taskNameInput.classList.add('active')
    taskNameInput.focus()
  }

  static openDueDateInput(taskButton) {
    const dueDatePara = taskButton.children[1].children[0]
    const dueDateInput = taskButton.children[1].children[1]
    dueDatePara.classList.add('active')
    dueDateInput.classList.add('active')
  }

  static closeDateInput(taskButton) {
    const dueDatePara = taskButton.children[1].children[0]
    const dueDateInput = taskButton.children[1].children[1]
    dueDatePara.classList.remove('active')
    dueDateInput.classList.remove('active')
    console.log("closing date input")
  }


  static closeRenameInput(taskButton) {
    const taskName = taskButton.children[0].children[1]
    const taskNameInput = taskButton.children[0].children[2]

    taskName.classList.remove('active')
    taskNameInput.classList.remove('active')
    taskNameInput.value = ''
  }

  static renameTask(e) {
    console.log(e.key)
    if (e.key !== 'Enter') return

    const projectName = document.getElementById('project-name').textContent
    const taskName = this.previousElementSibling.textContent
    const newTaskName = this.value

    if (newTaskName === '') {
      alert("Task name can't be empty")
      return
    }

    if (Storage.getTodoList().getProject(projectName).contains(newTaskName)) {
      this.value = ''
      alert('Task names must be different')
      return
    }

    if (projectName === 'Today' || projectName === 'This week') {
      const mainProjectName = taskName.split('(')[1].split(')')[0]
      const mainTaskName = taskName.split(' ')[0]

      Storage.renameTask(
        projectName,
        taskName,
        `${newTaskName} (${mainProjectName})`
      )

      Storage.renameTask(mainProjectName, mainTaskName, newTaskName)
    } else {
      Storage.renameTask(projectName, taskName, newTaskName)
    }
    UI.clearTasks()
    UI.loadTasks(projectName)
    UI.closeRenameInput(this.parentNode.parentNode)
  }

  static setTaskDate() {

    const selectedDate = new Date(this.value);

    if (selectedDate.getFullYear() < 1995 || selectedDate.getFullYear() > 2030) {
      return; // Return early if the date is not within the range
    }

    const newDueDate = format(new Date(this.value), 'dd/MM/yyyy')

    const projectName = UI.getProjectName()
    const taskButton = this.parentNode.parentNode
    const taskName = UI.getTaskName(taskButton)

    if (projectName === 'Today' || projectName === 'This week') {
      const mainProjectName = taskName.split('(')[1].split(')')[0]
      const mainTaskName = taskName.split(' (')[0]
      Storage.setTaskDate(projectName, taskName, newDueDate)
      Storage.setTaskDate(mainProjectName, mainTaskName, newDueDate)

      if (projectName === 'Today') {
        Storage.updateTodayProject()
      } else {
        Storage.updateWeekProject()
      }
    } else {
      Storage.setTaskDate(projectName, taskName, newDueDate)
    }
    UI.clearTasks()
    UI.loadTasks(projectName)
    UI.closeDateInput(taskButton)
  }

  // PROJECT ADD EVENT LISTENERS

  static initAddProjectButtons() {
    const addProjectButton = document.getElementById('button-add-project')
    const addProjectPopupButton = document.getElementById(
      'button-add-project-popup'
    )
    const cancelProjectPopupButton = document.getElementById(
      'button-cancel-project-popup'
    )
    const addProjectPopupInput = document.getElementById(
      'input-add-project-popup'
    )

    addProjectButton.addEventListener('click', UI.openAddProjectPopup)
    addProjectPopupButton.addEventListener('click', UI.addProject)
    cancelProjectPopupButton.addEventListener('click', UI.closeAddProjectPopup)
    addProjectPopupInput.addEventListener(
      'keypress',
      UI.handleAddProjectPopupInput
    )
  }

  static openAddProjectPopup() {
    const addProjectPopup = document.getElementById('add-project-popup')
    const addProjectButton = document.getElementById('button-add-project')

    UI.closeAllPopups()
    addProjectPopup.classList.add('active')
    addProjectButton.classList.add('active')
  }

  static closeAddProjectPopup() {
    const addProjectPopup = document.getElementById('add-project-popup')
    const addProjectButton = document.getElementById('button-add-project')
    const addProjectPopupInput = document.getElementById(
      'input-add-project-popup'
    )

    addProjectPopup.classList.remove('active')
    addProjectButton.classList.remove('active')
    addProjectPopupInput.value = ''
  }

  static addProject() {
    const addProjectPopupInput = document.getElementById(
      'input-add-project-popup'
    )
    const projectName = addProjectPopupInput.value

    if (projectName === '') {
      alert("Project name can't be empty")
      return
    }

    // if (Storage.getTodoList().contains(projectName)) {
    //   addProjectPopupInput.value = ''
    //   alert('Project names must be different')
    //   return
    // }

    Storage.addProject(new Project(projectName))
    UI.createProject(projectName)
    UI.closeAddProjectPopup()
  }

  static handleAddProjectPopupInput(e) {
    if (e.key === 'Enter') UI.addProject()
  }


}