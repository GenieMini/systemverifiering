function createUserAndTask() {
    cy.fixture('user').as('userJson').then(function (userJson) {
        cy.request({
            url: 'http://localhost:5000/users/create',
            form: true,
            body: userJson,
            method: 'POST'
        }).then((response) => {
            const userID = response.body['_id']['$oid'];
            cy.wrap(userID).as('userID');

            cy.fixture('tasks')
            .then((task) => {
                task['userid'] = userID;

                cy.request({
                    url: 'http://localhost:5000/tasks/create',
                    method: 'POST',
                    form: true,
                    body: task
                })
            })

        })
    })
}

function loginUser() {
    cy.visit('http://localhost:3000/')
    cy.get('#email').type("test@test.com")
    cy.get('form').submit()
}

function selectTask() {
    cy.get(".container-element a").first().click()
}

function deleteUser() {
    cy.get('@userID').then(userID => {
        cy.log("Delete user")
        cy.request({
            url: `http://localhost:5000/users/${userID}`,
            method: 'DELETE'
        })
    })
}

describe('Users task testing', () => {
    // setup
    beforeEach(() => {
        createUserAndTask()
        loginUser()
        selectTask()
    })

    afterEach(() => {
        deleteUser()
    })

    // R8UC1
    it('Check that there are 1 ‘todo’-items', () => {
        cy.get('.todo-item').should('have.length', 1)
    });

    it('Check that there are 2 ‘todo’-items after adding 1 ‘todo’-item', () => {
        cy.get('.inline-form').find('input[type=text]').type('New todo')
        cy.get('.inline-form').find('input[type=submit]').click()
        cy.get('.todo-item').should('have.length', 2)
    })

    it('Check that the input field is empty', () => {
        cy.get('.inline-form').find('input[type=text]').should('have.value', '');
    })

    it('Check that the “add” button is disabled', () => {
        cy.get('.inline-form').find('input[type=submit]').should('be.disabled')
    })

    it('Check that the “add” button is disabled even after adding and removing string', () => {
        cy.get('.inline-form').find('input[type=text]').type('New todo')
        cy.get('.inline-form').find('input[type=text]').clear()
        cy.get('.inline-form').find('input[type=submit]').should('be.disabled')
    })

    // R8UC2
    it('Check that the first checkbox is unchecked', () => {
        cy.get('.checker').first().should('have.class', 'unchecked')
    })

    it('Check that the first checkbox is checked after clicked', () => { // fails
        cy.get('.checker').first().click() // checks
        cy.get('.checker').first().should('have.class', 'checked')
    })

    it('Check that the first checkbox is unchecked after clicked twice', () => { // fails
        cy.get('.checker').first().click() // checks
        cy.get('.checker').first().click() // unchecks
        cy.get('.checker').first().should('have.class', 'unchecked')
    })

    it('Check that the text of the first ‘todo’ has stricken through text-decoration', () => { // fails
        cy.get('.checker').first().click() // checks
        cy.get('.todo-list .editable').first().should('have.css', 'text-decoration-line').and('include', 'line-through')
    })

    // R8UC3

    it('Check that there are 0 ‘todo’-items after removing 1 ‘todo’-item', () => { // fails
        cy.get('.remover').first().click()
        cy.get('.todo-item').should('not.exist')
    });
})