'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Customer Actions
export async function createCustomer(
  name: string,
  email: string,
  phone: string,
  location: string,
  address: string
) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const customer = db.insert('customers', { name, email, phone, location, address } as any);

    revalidatePath('/dashboard/customers');
    return { success: true, customer };
  } catch (error) {
    console.error('[Customer] Create error:', error);
    return { error: 'Failed to create customer' };
  }
}

export async function getCustomers() {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const result = (db.select('customers') as any[]).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return result;
  } catch (error) {
    console.error('[Customer] Get error:', error);
    return [];
  }
}

export async function updateCustomer(
  id: string,
  name: string,
  email: string,
  phone: string,
  location: string,
  address: string
) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    db.update('customers', id, { name, email, phone, location, address });

    revalidatePath('/dashboard/customers');
    return { success: true };
  } catch (error) {
    console.error('[Customer] Update error:', error);
    return { error: 'Failed to update customer' };
  }
}

// Loan Actions
export async function createLoan(
  customerId: string,
  loanAmount: number,
  principalAmount: number,
  interestRate: number,
  loanType: string,
  startDate: Date,
  endDate?: Date
) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const loan = db.insert('loans', {
      customerId,
      loanAmount,
      principalAmount,
      interestRate,
      loanType,
      startDate,
      endDate,
      status: 'Active',
    } as any);

    revalidatePath('/dashboard/loans');
    return { success: true, loan };
  } catch (error) {
    console.error('[Loan] Create error:', error);
    return { error: 'Failed to create loan' };
  }
}

export async function getLoans() {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const result = (db.select('loans') as any[]).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return result;
  } catch (error) {
    console.error('[Loan] Get error:', error);
    return [];
  }
}

export async function getLoansByCustomer(customerId: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const result = (db.select('loans') as any[])
      .filter((l) => l.customerId === customerId)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

    return result;
  } catch (error) {
    console.error('[Loan] Get by customer error:', error);
    return [];
  }
}

export async function updateLoanStatus(id: string, status: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    db.update('loans', id, { status });

    revalidatePath('/dashboard/loans');
    return { success: true };
  } catch (error) {
    console.error('[Loan] Update status error:', error);
    return { error: 'Failed to update loan status' };
  }
}

// Payment Actions
export async function createPayment(
  loanId: string,
  amount: number,
  date: Date,
  type: string = 'Regular'
) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const payment = db.insert('payments', { loanId, amount, date, type } as any);

    revalidatePath('/dashboard/payments');
    revalidatePath('/dashboard/loans');
    return { success: true, payment };
  } catch (error) {
    console.error('[Payment] Create error:', error);
    return { error: 'Failed to record payment' };
  }
}

export async function getPayments() {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const result = (db.select('payments') as any[]).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    return result;
  } catch (error) {
    console.error('[Payment] Get error:', error);
    return [];
  }
}

export async function getPaymentsByLoan(loanId: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const result = (db.select('payments') as any[])
      .filter((p) => p.loanId === loanId)
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });

    return result;
  } catch (error) {
    console.error('[Payment] Get by loan error:', error);
    return [];
  }
}

// Report Actions
export async function getReportData() {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const allCustomers = db.select('customers') as any[];
    const allLoans = db.select('loans') as any[];
    const allPayments = db.select('payments') as any[];

    return { customers: allCustomers, loans: allLoans, payments: allPayments };
  } catch (error) {
    console.error('[Report] Get error:', error);
    return { customers: [], loans: [], payments: [] };
  }
}
