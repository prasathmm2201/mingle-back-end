## create base
npm init

## implement a babel
1.install @babel/cli @babel/core @babel/node @babel/preset-env
2.create babelrc file 
3.in babelrc file create presets

## initialize server
1.install express
2.install dotenv

## DB connection
1.install knex and objection

## implement prettier
1.install prettier
2.create .prettierrc.json
3.create .prettierignore

## pre-commit husky
1.install husky and @commitlint/cli and @commitlint/config-conventional
2.create commitlint.config.js file

# migrate:
1.make migratation
npx knex migrate:make 'app_build' --knexfile ./DB/index.js

2.run latest migration
npx knex migrate:latest --knexfile ./DB/index.js

3.run migration specific file
npx knex migrate:up file_name.js --knexfile ./DB/index.js

# seed :
1.Run Specific Seeder
npx knex seed:run --specific='file_name.js' --knexfile ./DB/index.js

2.Run all Seeder
knex seed:run --knexfile ./DB/index.js

