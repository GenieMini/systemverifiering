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
    // Visit localhost:3000 (or corresponding url)
    cy.visit('http://localhost:3000/')
    // Enter Email in email field
    cy.get('#email').type("test@test.com")
    // Click “login”
    cy.get('form').submit()
}

function createTask() {
    // Enter Title in title field
    cy.get("#title").type("test")
    // Enter URL in url field
    cy.get("#url").type("QH2-TGUlwu4")
    // Click “create”
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

    // R8UC1
    it('Test user inputs description', () => {
        // Enter Label in ‘New todo’ field
        cy.get('.inline-form').find('input[type=text]').type('New todo')
        // Click “create”
        cy.get('.inline-form').find('input[type=submit]').click()
        // Check that there are 2 ‘todo’-items
        cy.get('.todo-item').should(list => expect(list).to.have.length(2))
        // Check that the “create” button is disabled
        cy.get('.inline-form').find('input[type=submit]').should('be.disabled')
    });

    // R8UC3
    it('Test remove todo', () => {
        // Check that there are 2 ‘todo’-items
        cy.get('.todo-item').should(list => expect(list).to.have.length(2))
        // Press remove on first ‘todo’
        cy.get('.remover').first().click().click()
        // Check that there is 1 ‘todo’-item
        cy.get('.todo-item').should(list => expect(list).to.have.length(1))
    });

    // R8UC2
    it('Test checker unchecked', () => {
        // Check that the first checkbox is unchecked
        cy.get('.checker').first().should('have.class', 'unchecked')
        // Click the first checkbox
        cy.get('.checker').first().click().click()
        // Check that the first checkbox is checked
        cy.get('.checker').first().should('have.class', 'checked')
        // Check that the text of the first ‘todo’ has stricken through text-decoration
        cy.get('.todo-list .editable').first().should('have.css', 'text-decoration-line').and('include', 'line-through')
    })

    // R8UC2-reset
    it('Reset checked', () => {
        cy.get('.checker').first().click().click().click()
    })
})