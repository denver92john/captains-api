const ListService = {
    getAllLists(db) {
        return db.select('*').from('captains_lists')
    }
}

module.exports = ListService;