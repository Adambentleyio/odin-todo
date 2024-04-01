
// First make a class for the task
// A constructor for when the task is created including name, date, description, priority, and project

export default class Task {
    constructor(name, dueDate = 'No date', description = '', priority = '') {
        this.name = name;
        this.dueDate = dueDate;
        this.description = description
        this.priority = priority
    }

    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setDate(dueDate) {
        this.dueDate = dueDate;
    }
    getDate() {
        return this.dueDate;
    }
    getDateFormatted() {
    const day = this.dueDate.split('/')[0]
    const month = this.dueDate.split('/')[1]
    const year = this.dueDate.split('/')[2]
    return `${month}/${day}/${year}`
    }
}