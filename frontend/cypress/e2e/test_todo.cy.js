/*
    Cypress tests for Requirement 8
*/

let userID = '';
let taskID = '';

function createUser() {
    cy.fixture('user')
    .then((userJson) => {
        cy.request({
            url: 'http://localhost:5000/users/create',
            form: true,
            body: userJson,
            method: 'POST'
        }).then((response) => {
            userID = response.body['_id']['$oid'];
        })
    })
}

function createTaskAndTodo() {
    cy.fixture('tasks')
    .then((task) => {

        task['userid'] = userID;

        // Create Task
        cy.request({
            url: 'http://localhost:5000/tasks/create',
            method: 'POST',
            form: true,
            body: task
        })
        .then((response) => {
            // Create todo with "Done" state
            taskID = response.body[0]['_id']['$oid'];
            const data = `taskid=${taskID}&description=Example&done=true`;
            cy.request({
                url: 'http://localhost:5000/todos/create',
                method: 'POST',
                body: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
        })
    })
    
}

function loginUser() {
    cy.get('#email').type("test@test.com")
    cy.get('form').submit()
}

function selectTask() {
    cy.get(".container-element a").first().click()
}

function deleteUser() {
    cy.log("Delete user")
    cy.request({
        url: `http://localhost:5000/users/${userID}`,
        method: 'DELETE'
    })
}

describe('Users task testing', () => {
    // setup
    beforeEach(() => {
        cy.visit('localhost:3000')
        createUser()
        createTaskAndTodo()
        loginUser()
        selectTask()
    })

    afterEach(() => {
        deleteUser()
    })

    // R8UC1
    it('Check if new todo is appended to the bottom of list and is set to Active', () => {
        const todo_description = 'New todo';

        cy.get('.inline-form').find('input[type=text]').type(todo_description)
        cy.get('.inline-form').find('input[type=submit]').click()
        cy.get('.todo-item .editable').last().should("have.text", todo_description).and('not.have.css', 'text-decoration-line', 'line-through')
    })

    it('Check if the “add” button is disabled when text field is empty', () => {
        cy.get('.inline-form').find('input[type=text]').clear()
        cy.get('.inline-form').find('input[type=submit]').should('be.disabled')
    })

    // R8UC2
    it('Check if the todo changes from Active to Done after clicking icon', () => { // fails
        cy.get('.checker').first().click() // set to Done
        cy.get('.todo-list .editable').first().should('have.css', 'text-decoration-line', 'line-through')
    })

    it('Check if the todo changes from Done to Active after clicking icon', () => { // fails
        // .last() refers to todo with Done
        cy.get('.checker').last().click() // Set to Active
        cy.get('.todo-list .editable').last().should('not.have.css', 'text-decoration-line', 'line-through')
    })

    // R8UC3
    it('Check if todo-item gets removed', () => { // fails
        const remove_todo = 'Watch';

        cy.get('.todo-item').contains("span", remove_todo).parent().find('.remover').click()
        cy.get('.todo-item').contains("span", remove_todo).should('not.exist')
    });
})