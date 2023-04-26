function createUser() {
    cy.fixture('user').as('userJson').then(function (userJson) {
        cy.request({
            url: 'http://localhost:5000/users/create',
            form: true,
            body: userJson,
            method: 'POST'
        }).then((response) => {
            cy.wrap(response.body['_id']['$oid']).as('userID');
        })
    })
}

function loginUser() {
    cy.visit('http://localhost:3000/')

    cy.get('#email').type("test@test.com")

    cy.get('form').submit()
}

function createTask() {
    cy.get("#title").type("test")
    cy.get("#url").type("QH2-TGUlwu4")
    cy.get("form").submit()
}

function selectTask() {
    cy.get(".container-element a").first().click()
}

function deleteUser() {
    cy.get('@userID').then(userID => {
        cy.request({
            url: `http://localhost:5000/users/${userID}`,
            method: 'DELETE'
        })
    })
}

describe('Users task testing', () => {
    beforeEach(() => {
        createUser()
        loginUser()
        createTask()
        selectTask()
    })

    afterEach(() => {
        deleteUser()
    })

    // R8UC1-1
    it('Test user inputs description', () => {
        // First type the task name.
        cy.get('.inline-form').find('input[type=text]').type('New todo')
        // Submit task
        cy.get('.inline-form').find('input[type=submit]').click()
        // Check if task is there
        cy.get('.todo-item').should(list => expect(list).to.have.length(2))
    });

    // R8UC3
    it('Test remove todo', () => {
        cy.get('.remover').first().click().click()
        cy.get('.todo-item').should(list => expect(list).to.have.length(1))
    });

    // R8UC1-2
    it('Test user inputs "add" button disabled', () => {
        // check if diabled
        cy.get('.inline-form').find('input[type=submit]').should('be.disabled')
    });

    // R8UC2-1
    it('Test checker unchecked', () => {
        cy.get('.checker').first().should('have.class', 'unchecked')
    })

    // R8UC2-1.5
    it('Test checker checked', () => {
        cy.get('.checker').first().click().click()
        cy.get('.checker').first().should('have.class', 'checked')
    })

    // R8UC2-2
    it('Test editable for line through', () => {
        cy.get('.todo-list .editable').first().should('have.css', 'text-decoration-line').and('include', 'line-through')
    })

    // R8UC2-reset
    it('Reset checked', () => {
        cy.get('.checker').first().click().click().click()
    })
})