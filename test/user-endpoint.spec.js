const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('User endpoint', () => {
    let db;

    const {testUser} = helpers.makeListsFixtures();

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/user`, () => {
        context(`User validation`, () => {
            beforeEach('insert user', () => {
                helpers.seedUser(db, testUser)
            })

            const requiredFields = ['username', 'password', 're_password'];

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    username: 'test username',
                    password: 'test password',
                    re_password: 'test password'
                }

                it(`responds 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]
                    return supertest(app)
                        .post('/api/user')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: {message: `Missing '${field}' in request body`}
                        })
                })
            })

            it(`responds 400 when passwords don't match`, () => {
                const userPasswordsDontMatch = {
                    username: 'test username',
                    password: 'test password',
                    re_password: 'test re_password'
                }

                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordsDontMatch)
                    .expect(400, {
                        error: {message: `Passwords don't match`}
                    })
            })

            it(`responds 400 when password is shorter than 8 characters`, () => {
                const userPasswordShort = {
                    username: 'test username',
                    password: '1234567',
                    re_password: '1234567'
                }

                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordShort)
                    .expect(400, {
                        error: {message: `Password must be longer than 8 characters`}
                    })
            })

            it(`responds 400 when password is longer than 72 characters`, () => {
                const userPasswordLong = {
                    username: 'test username',
                    password: '*'.repeat(73),
                    re_password: '*'.repeat(73)
                }

                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordLong)
                    .expect(400, {
                        error: {message: `Password must be less than 72 characters`}
                    })
            })

            it(`responds 400 when username is already taken`, () => {
                const duplicateUser = {
                    username: testUser.username,
                    password: 'JDenver1!',
                    re_password: 'JDenver1!'
                }

                return supertest(app)
                    .post('/api/user')
                    .send(duplicateUser)
                    .expect(400, {
                        error: {message: `Username already taken`}
                    })
            })
        })

        context('Happy path', () => {
            it(`responds 201, serialized user, storing bcryped password`, () => {
                const newUser = {
                    username: 'test username',
                    password: 'TestPassword1!',
                    re_password: 'TestPassword1!'
                }

                return supertest(app)
                    .post('/api/user')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.username).to.eql(newUser.username)
                        expect(res.body).to.not.have.property('password')
                    })
                    .expect(res => 
                        db
                            .from('captains_users')
                            .select('*')
                            .where({id: res.body.id})
                            .first()
                            .then(row => {
                                expect(row.username).to.eql(newUser.username)
                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            })
        })
    })
})