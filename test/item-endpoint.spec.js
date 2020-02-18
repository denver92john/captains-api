const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Item endpoint', () => {
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

    describe('GET /api/item', () => {
        context('Given no items', () => {
            beforeEach(() => 
                helpers.seedUser(db, testUser)
            )

            it('responds with 200 and an empty list of items', () => {
                return supertest(app)
                    .get('/api/item')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, [])
            })
        })
    })

    describe('POST /api/item', () => {
        beforeEach('insert lists', () => {
            helpers.seedCaptainsTables(
                db,
                testUser,
                testLists,
                testItems
            )
        })

        it(`creates new item, responding with 201 and the new item`, () => {
            const newItem = {
                item_name: 'Rose',
                list_id: testLists[1].id
            }
            return supertest(app)
                .post('/api/item')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newItem)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.item_name).to.eql(newItem.item_name)
                    expect(res.body.list_id).to.eql(newItem.list_id)
                })
                .expect(res =>
                    db
                        .from('captains_items')
                        .select('*')
                        .where({id: res.body.id})
                        .first()
                        .then(row => {
                            expect(row.item_name).to.eql(newItem.item_name)
                            expect(row.list_id).to.eql(newItem.list_id)
                        })
                )
        })
    })

    describe('DELETE /api/item/:item_id', () => {
        context('Given no item', () => {
            beforeEach(() => 
                helpers.seedUser(db, testUser)
            )

            it('responds with 404', () => {
                const item_id = 1234;
                return supertest(app)
                    .delete(`/api/item/${item_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {error: {message: `Item doesn't exist`}})
            })
        })

        context('Given item does exist', () => {
            beforeEach('insert lists', () => {
                helpers.seedCaptainsTables(
                    db,
                    testUser,
                    testLists,
                    testItems
                )
            })

            it('responds with 200 and removes item', () => {
                const idToRemove = 2;
                const expectedItems = testItems.filter(item => item.id !== idToRemove);
                return supertest(app)
                    .delete(`/api/item/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(204)
                    .then(() => 
                        supertest(app)
                            .get('/api/item')
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(expectedItems)
                    )
            })
        })
    })

    describe('PATCH /api/item/:item_id', () => {
        context('Given no item', () => {
            beforeEach(() => 
                helpers.seedUser(db, testUser)
            )

            it('responds with 404', () => {
                const item_id = 1234;
                return supertest(app)
                    .patch(`/api/item/${item_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {error: {message: `Item doesn't exist`}})
            })
        })

        context('Given item exists', () => {
            beforeEach('insert lists', () => {
                helpers.seedCaptainsTables(
                    db,
                    testUser,
                    testLists,
                    testItems
                )
            })

            it('responds with 204 and updates the item', () => {
                const idToUpdate = 1;
                const itemUpdate = {
                    item_name: 'This updated',
                    list_id: 1
                }
                const expectedItem = {
                    ...testItems[idToUpdate - 1],
                    ...itemUpdate
                }
                return supertest(app)
                    .patch(`/api/item/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(itemUpdate)
                    .expect(204)
                    /*
                    .then(() => 
                        supertest(app)
                            .get(`/api/item/${idToUpdate}`)
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(expectedItem)
                    )*/
            })
            
        })
    })

    describe('GET /api/item/list/:list_id', () => {
        context('given no items in list', () => {
            beforeEach(() => 
                helpers.seedUser(db, testUser)
            )

            it('responds with 200 and an empty list', () => {
                const list_id = 1234;
                return supertest(app)
                    .get(`/api/item/list/${list_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, [])
            })
        })

        context('given there are items in list', () => {
            beforeEach('insert lists', () => {
                helpers.seedCaptainsTables(
                    db,
                    testUser,
                    testLists,
                    testItems
                )
            })

            it('responds with 200 and list of items', () => {
                const list_id = 1;
                const expectedItems = helpers.makeExpectedListItems(list_id, testItems);
                return supertest(app)
                    .get(`/api/item/list/${list_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedItems)
            })
        })
    })
})