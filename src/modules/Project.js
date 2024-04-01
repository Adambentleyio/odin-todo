import { toDate, isToday, isThisWeek, subDays } from 'date-fns'

export default class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    setName(name) {
      this.name = name
    }

    getName() {
      return this.name
    }

    setTasks(tasks) {
        this.tasks = tasks;
    }

    getTasks() {
        this.tasks = this.tasks.filter((task) => task.name !== undefined)
        return this.tasks;
    }

    getTask(name) {
        return this.tasks.find(task => task.name === name);
    }


  contains(taskName) {
    return this.tasks.some((task) => task.getName() === taskName)
  }

  addTask(newTask) {
    if (this.tasks.find((task) => task.getName() === newTask.name)) return
    this.tasks.push(newTask)
  }

  deleteTask(taskName) {
    this.tasks = this.tasks.filter((task) => task.name !== taskName)
  }

  getTasksToday() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted())
      return isToday(toDate(taskDate))
    })
  }

  getTasksThisWeek() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted())
      return isThisWeek(subDays(toDate(taskDate), 1))
    })
  }
}
