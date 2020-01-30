const xss = require('xss');

// get rid of getAllItems and make use of the other methods

const ItemService = {
    getAllItems(db) {
        return db
            .from('captains_items AS item')
            .select(
                'item.id',
                'item.item_name',
                db.raw(
                    `json_build_object(
                        'id', ls.id,
                        'list_name', ls.list_name
                    ) AS "list"`
                )
            )
            .leftJoin(
                'captains_lists AS ls',
                'item.list_id',
                'ls.id'
            )
    },
    getItemsByListId(db, listId) {
        return ItemService.getAllItems(db)
            .where('ls.id', listId)
    },
    getByItemId(db, id) {
        return ItemService.getAllItems(db)
            .where('item.id', id)
            .first()
    },
    insertItem(db, newItem) {
        return db
            .insert(newItem)
            .into('captains_items')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteItemById(db, id) {
        return db('captains_items')
            .where({id})
            .delete()
    },
    updateItemById(db, id, newItemFields) {
        return db('captains_items')
            .where({id})
            .update(newItemFields)
    },
    serializeItem(item) {
        const {list} = item;
        return {
            id: item.id,
            item_name: xss(item.item_name),
            list: {
                id: list.id,
                list_name: xss(list.list_name)
            }
        }
    }
}

module.exports = ItemService;