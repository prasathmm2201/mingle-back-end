/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return new Promise(async(resolve , reject)=>{
        try{
            await knex.schema.createTableIfNotExists("message", (t) => {
                t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
                t.uuid("sender").references("id").inTable("public.user_profiles");
                t.string("message");
                t.boolean("is_active").defaultTo(true);
                t.timestamps(true, true);
              });
              await knex.schema.createTableIfNotExists("receivers", (t) => {
                t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
                t.uuid("receivers").references("id").inTable("public.user_profiles");
                t.uuid("message_id").references("id").inTable("public.message");
                t.boolean("is_active").defaultTo(true);
                t.timestamps(true, true);
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
