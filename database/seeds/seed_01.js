
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'hannah1', password: "pass"},
        {id: 2, username: 'alexlovesdogs', password: "pass"},
        {id: 3, username: 'hahaha', password: "pass"}
      ]);
    });
};
