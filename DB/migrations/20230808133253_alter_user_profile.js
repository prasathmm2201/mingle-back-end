/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("user_profiles", (t) => {
        t.jsonb("image_urls");
        t.jsonb("interest");
        t.text("latitude");
        t.text("longitude");
        t.enu("gender", ["Male", "Female", "Transgender"], {
            useNative: true,
            enumName: "gender",
          });
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
