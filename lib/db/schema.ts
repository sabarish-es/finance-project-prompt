import { sqliteTable, text, real, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  location: text('location'),
  address: text('address'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const loans = sqliteTable('loans', {
  id: text('id').primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  customerId: text('customerId').notNull(),
  loanAmount: real('loanAmount').notNull(),
  principalAmount: real('principalAmount').notNull(),
  interestRate: real('interestRate').default(0),
  loanType: text('loanType').default('Personal'),
  status: text('status').default('Active'), // Active, Closed, Defaulted
  startDate: integer('startDate', { mode: 'timestamp' }).notNull(),
  endDate: integer('endDate', { mode: 'timestamp' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  loanId: text('loanId').notNull(),
  amount: real('amount').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  type: text('type').default('Regular'), // Regular, Partial, Full
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  loans: many(loans),
}));

export const loansRelations = relations(loans, ({ one, many }) => ({
  customer: one(customers, {
    fields: [loans.customerId],
    references: [customers.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  loan: one(loans, {
    fields: [payments.loanId],
    references: [loans.id],
  }),
}));
