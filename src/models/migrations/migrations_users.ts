import {Knex} from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('user').then(exists => {
    if (!exists) {
      return knex.schema.createTable('users', (table) => {
        table.string('id', 22).notNullable().primary().unique()
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.string('picture').notNullable()
        table.boolean('isAdmin').notNullable().defaultTo(false)
        table.integer('createAt').notNullable()
        table.integer('updateAt').notNullable()
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}