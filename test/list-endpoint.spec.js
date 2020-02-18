const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('List endpoint', () => {
    let db;

    const {
        testUser,
        testLists,
        testItems
    } = helpers.makeListsFixtures()

    

    describe('GET /api/list', () => {
        context('Given no lists', () => {
            beforeEach(() => 
                helpers.seedUser(db, testUser)
            )

            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/list')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, [])
            })
        })

        context('Given there are lists in database', () => {
            beforeEach('insert lists', () => {
                helpers.seedCaptainsTables(
                    db,
                    testUser,
                    testLists,
                    testItems
                )
            })

            it('responds with 200 and all lists', () => {
                const expectedLists = testLists.map(list =>
                    helpers.makeExpectedList(testUser, list)
                )
                return supertest(app)
                    .get('/api/list')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedLists)
            })
        })
    })

    //describe('POST /api/list', () => {})
    
    describe('GET /api/list/:list_id', () => {
        context('Given no list', () => {
            beforeEach(() => 
                helpers.seedUser(db, testUser)
            )

            it('responds 404', () => {
                const list_id = 1234;
                return supertest(app)
                    .get(`/api/list/${list_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {error: {message: `List doesn't exist`}})
            })
        })

        context('Given there is a list', () => {
            beforeEach('insert lists', () => {
                helpers.seedCaptainsTables(
                    db,
                    testUser,
                    testLists,
                    testItems
                )
            })

            it('responds with 200 and specific list', () => {
                const list_id = 1;
                const expectedList = helpers.makeExpectedList(testUser, testLists[list_id - 1])
                return supertest(app)
                    .get(`/api/list/${list_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedList)
            })
        })
    })

    describe('DELETE /api/list/:list_id', () => {
        context('Given no list', () => {
            beforeEach(() => 
                helpers.seedUser(db, testUser)
            )

            it('responds with 404', () => {
                const list_id = 1234;
                return supertest(app)
                    .delete(`/api/list/${list_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {error: {message: `List doesn't exist`}})
            })
        })

        context('Given the list exist', () => {
            beforeEach('insert lists', () => {
                helpers.seedCaptainsTables(
                    db,
                    testUser,
                    testLists,
                    testItems
                )
            })

            it('responds with 204 and removes list', () => {
                const idToRemove = 2;
                const expectedLists = testLists.filter(list => list.id !== idToRemove);
                return supertest(app)
                    .delete(`/api/list/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(204)
                    .then(() => 
                        supertest(app)
                            .get(`/api/list`)
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(expectedLists)
                    )
            })
        })
    })

    //describe('PATCH /api/list/:list_id', () => {})
})