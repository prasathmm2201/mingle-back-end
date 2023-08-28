/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("group", (t) => {
        t.uuid("created_by").references("id").inTable("public.user_profiles");
        t.uuid("updated_by").references("id").inTable("public.user_profiles");    
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
