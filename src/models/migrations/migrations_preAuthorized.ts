import {Knex} from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('preAuthorized').then(exists => {
    if (!exists) {
      return knex.schema.createTable('preAuthorized', (table) => {
        table.string('email').notNullable().unique()
        table.integer('isAdmin').notNullable().unique()
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('preAuthorized')
}