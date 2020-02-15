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

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

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

    describe('POST /api/list', () => {})
    /*
    describe('GET /api/list/:list_id', () => {
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
                console.log(expectedList)
                console.log(testLists[list_id -1])
                return supertest(app)
                    .get(`/api/list/${list_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedList)
            })
        })
    })*/

    describe('DELETE /api/list/:list_id', () => {})

    describe('PATCH /api/list/:list_id', () => {})
})