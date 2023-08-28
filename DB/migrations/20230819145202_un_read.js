/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return new Promise(async(resolve , reject)=>{
        try{
            await knex.schema.createTableIfNotExists("un_read", (t) => {
                t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
                t.uuid("user").references("id").inTable("public.user_profiles");
                t.uuid("message").references("id").inTable("public.message");
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
