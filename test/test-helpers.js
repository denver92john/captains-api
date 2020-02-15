const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUser() {
    return {
        id: 1,
        username: 'JDenver',
        password: 'JDenver1!'
    }
}

function makeListArray(user) {
    return [
        {
            id: 1,
            list_name: 'New Years Eve',
            user_id: user.id
        },
        {
            id: 2,
            list_name: 'Turkey Day',
            user_id: user.id
        }
    ]
}

function makeItemArray(lists) {
    return [
        {
            id: 1,
            item_name: 'Joe',
            list_id: lists[0].id
        },
        {
            id: 2,
            item_name: 'Kev',
            list_id: lists[0].id
        },
        {
            id: 3,
            item_name: 'Ben',
            list_id: lists[0].id
        },
        {
            id: 4,
            item_name: 'Ava',
            list_id: lists[0].id
        },
        {
            id: 5,
            item_name: 'Mary',
            list_id: lists[1].id
        },
        {
            id: 6,
            item_name: 'Dave',
            list_id: lists[1].id
        },
        {
            id: 7,
            item_name: 'Steve',
            list_id: lists[1].id
        },
        {
            id: 8,
            item_name: 'Zac',
            list_id: lists[1].id
        }
    ]
}

function makeExpectedList(user, list) {
    return {
        id: list.id,
        list_name: list.list_name,
        user_id: user.id
    }
}

//function makeExpectedItems(list, items=[]) {}

function makeListsFixtures() {
    const testUser = makeUser();
    const testLists = makeListArray(testUser);
    const testItems = makeItemArray(testLists);
    return {testUser, testLists, testItems}
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
                captains_users,
                captains_lists,
                captains_items`
        )
        .then(() => 
            Promise.all([
                trx.raw(`ALTER SEQUENCE captains_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE captains_lists_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE captains_items_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('captains_users_id_seq', 0)`),
                trx.raw(`SELECT setval('captains_lists_id_seq', 0)`),
                trx.raw(`SELECT setval('captains_items_id_seq', 0)`)
            ])
        )
    )
}

function seedUser(db, user) {
    const preppedUser = {
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }
    return db.into('captains_users').insert(preppedUser)
        .then(() => 
            db.raw(
                `SELECT setval('captains_users_id_seq', ?)`,
                user.id
            )
        )
}

function seedCaptainsTables(db, user, lists, items = []) {
    return db.transaction(async trx => {
        await seedUser(trx, user)
        await trx.into('captains_lists').insert(lists)
        await trx.raw(
            `SELECT setval('captains_lists_id_seq', ?)`,
            [lists[lists.length - 1].id]
        )
        if(items.length) {
            await trx.into('captains_items').insert(items)
            await trx.raw(
                `SELECT setval('captains_items_id_seq', ?)`,
                [items[items.length - 1].id]
            )
        }
    })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({user_id: user.id}, secret, {
        subject: user.username,
        algorithm: 'HS256'
    })
    return `Bearer ${token}`
}

module.exports = {
    makeUser,
    makeListArray,
    makeItemArray,
    makeExpectedList,
    makeListsFixtures,
    cleanTables,
    seedUser,
    seedCaptainsTables,
    makeAuthHeader
}