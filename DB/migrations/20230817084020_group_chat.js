/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return new Promise(async(resolve , reject)=>{
        try{
            await knex.schema.createTableIfNotExists("group", (t) => {
                t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
                t.string("name").unique(true);
                t.boolean("is_active").defaultTo(true);
                t.timestamps(true, true);
              });
              await knex.schema.createTableIfNotExists("members", (t) => {
                t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
                t.uuid("group_id").references("id").inTable("public.group");
                t.uuid("user").references("id").inTable("public.user_profiles");
                t.boolean("is_active").defaultTo(true);
                t.timestamps(true, true);
              });
              await knex.schema.alterTable("message", (t) => {
                t.uuid("group_id").references("id").inTable("public.group");
              });
              resolve()
        }
        catch(err){
            reject(err)
        }
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
