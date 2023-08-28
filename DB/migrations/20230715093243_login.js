/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists("user_profiles", (t) => {
        t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        t.string("username").unique();
        t.string("image_url");
        t.string("password");
        t.string("email_id");
        t.string("mobile_country_code");
        t.string("mobile_no");
        t.string("bio");
        t.boolean("is_verified").defaultTo(false);
        t.boolean("is_active").defaultTo(true);
        t.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
