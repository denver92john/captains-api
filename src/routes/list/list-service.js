const xss = require('xss');

const ListService = {
    getAllLists(db) {
        return db
            .from('captains_lists AS list')
            .select(
                'list.id',
                'list.list_name',
                //'list.user_id'
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
            //.groupBy('list.id', 'usr.id')
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
    serializeList(list) {
        const {user} = list;
        return {
            id: list.id,
            list_name: xss(list.list_name),
            user: {
                id: user.id,
                username: xss(user.username)
            }
        }
    }
}

module.exports = ListService;