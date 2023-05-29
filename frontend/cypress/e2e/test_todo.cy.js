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
    cy.get('@userID').then(userID => {
        const data = new URLSearchParams();
        data.append('title', "test");
        data.append('description', '(add a description here)');
        data.append('userid', userID);
        data.append('url', "QH2-TGUlwu4");
        data.append('todos', ['Watch video']);

        cy.request({
            url: 'http://localhost:5000/tasks/create',
            method: 'post',
            body: data
        })
    })
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
        createTask()
        loginUser()
        selectTask()
    })

    afterEach(() => {
        deleteUser()
    })

    // R8UC1
    it('Check that there are 1 ‘todo’-items', () => {
        cy.get('.todo-item').should(list => expect(list).to.have.length(1))
    });

    it('Check that there are 1 ‘todo’-items after adding 1 ‘todo’-item', () => {
        cy.get('.inline-form').find('input[type=text]').type('New todo')
        cy.get('.inline-form').find('input[type=submit]').click()
        cy.get('.todo-item').should(list => expect(list).to.have.length(2))
    })

    it('Check that the input field is empty', () => {
        cy.get('.inline-form').find('input[type=text]').should('have.value', '');
    })

    it('Check that the “create” button is disabled', () => {
        cy.get('.inline-form').find('input[type=submit]').should('be.disabled')
    })

    // R8UC3
    it('Check that there are 2 ‘todo’-items', () => {
        cy.get('.todo-item').should(list => expect(list).to.have.length(2))
    })

    it('Check that there are 1 ‘todo’-items after removing 1 ‘todo’-item', () => {
        cy.get('.remover').first().click()
        cy.get('.todo-item').should(list => expect(list).to.have.length(1))
    });

    // R8UC2
    it('Check that the first checkbox is unchecked', () => {
        cy.get('.checker').first().should('have.class', 'unchecked')
    })

    it('Check that the first checkbox is checked after clicked', () => {
        cy.get('.checker').first().click()
        cy.get('.checker').first().should('have.class', 'checked')
    })

    it('Check that the text of the first ‘todo’ has stricken through text-decoration', () => {
        cy.get('.todo-list .editable').first().should('have.css', 'text-decoration-line').and('include', 'line-through')
    })
})