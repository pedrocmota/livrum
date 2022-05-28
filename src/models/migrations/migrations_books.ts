import {Knex} from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('books').then(exists => {
    if (!exists) {
      return knex.schema.createTable('books', (table) => {
        table.string('id', 37).notNullable().primary().unique()
        table.string('title').notNullable()
        table.string('author').notNullable()
        table.string('categories').notNullable()
        table.integer('stock').notNullable()
        table.integer('createAt').notNullable()
        table.integer('updateAt').notNullable()
        table.binary('image').notNullable()
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('books')
}