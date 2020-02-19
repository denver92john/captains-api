const knex = require('knex');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const helpers = require('./test-helpers');

describe('Auth endpoints', () => {
    let db;

    const {testUser} = helpers.makeListsFixtures();

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

    describe(`POST /api/auth/login`, () => {
        beforeEach('insert users', () => 
            helpers.seedUser(db, testUser)
        )

        const requiredFields = ['username', 'password'];

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                username: testUser.username,
                password: testUser.password
            }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post('/api/auth/login')
                    .send(loginAttemptBody)
                    .expect(400, {error: {message: `Missing '${field}' in request body`}})
            })
        })

        it('responds 200 and JWT auth token using secret when valid creds', () => {
            const userValidCreds = {
                username: testUser.username,
                password: testUser.password
            }
            const expectedToken = jwt.sign(
                {user_id: testUser.id},
                process.env.JWT_SECRET,
                {
                    subject: testUser.username,
                    algorithm: 'HS256'
                }
            )
            return supertest(app)
                .post('/api/auth/login')
                .send(userValidCreds)
                .expect(200, {
                    authToken: expectedToken,
                    user: {
                        id: testUser.id,
                        username: testUser.username
                    }
                })
        })
    })
})