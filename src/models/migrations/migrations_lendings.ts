import {Knex} from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('lendings').then(exists => {
    if (!exists) {
      return knex.schema.createTable('lendings', (table) => {
        table.string('id', 37).notNullable().primary().unique()
        table.string('user', 22).notNullable()
        table.string('book', 37).notNullable()
        table.integer('borrowedAt').notNullable()
        table.integer('maxDate').notNullable()
        table.text('notes').notNullable()
        table.integer('status').notNullable()
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('lendings')
}