const xss = require('xss');

const ListService = {
    getAllLists(db) {
        return db
            .from('captains_lists AS list')
            .select(
                'list.id',
                'list.list_name',
                'list.user_id'
            )
    },
    getListsByUserId(db, userId) {
        return ListService.getAllLists(db)
            .where('list.user_id', userId)
    },
    getById(db, id) {
        return ListService.getAllLists(db)
            .where('list.id', id)
            .first()
    },
    insertList(db, newList) {
        return db
            .insert(newList)
            .into('captains_lists')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteListById(db, id) {
        return db('captains_lists')
            .where({id})
            .delete()
    },
    updateListById(db, id, newListFields) {
        return db('captains_lists')
            .where({id})
            .update(newListFields)
    },
    serializeList(list) {
        return {
            id: list.id,
            list_name: xss(list.list_name),
            user_id: list.user_id
        }
    }
}

module.exports = ListService;



/*
                db.raw(
                    `json_build_object(
                        'id', usr.id,
                        'username', usr.username
                    ) AS "user"`
                )
            )
            .leftJoin(
                'captains_users AS usr',
                'list.user_id',
                'usr.id'
            )
*/