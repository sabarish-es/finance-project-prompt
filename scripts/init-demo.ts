import bcryptjs from 'bcryptjs';
import { db } from '../lib/db';

async function initializeDemo() {
  try {
    console.log('[Init] Starting demo data initialization...');

    // Create demo user
    const hashedPassword = await bcryptjs.hash('demo123', 10);
    const users = (db.select('users') as any[]) || [];
    
    if (!users.find((u) => u.email === 'demo@example.com')) {
      db.insert('users', {
        email: 'demo@example.com',
        password: hashedPassword,
        name: 'Demo Manager',
      } as any);
      console.log('[Init] Created demo user: demo@example.com / demo123');
    }

    // Create demo customers
    const customers = (db.select('customers') as any[]) || [];
    if (customers.length === 0) {
      const customer1 = db.insert('customers', {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        address: '123 Main St, New York, NY 10001',
      } as any);

      const customer2 = db.insert('customers', {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 234-5678',
        location: 'Los Angeles, CA',
        address: '456 Oak Ave, Los Angeles, CA 90001',
      } as any);

      console.log('[Init] Created demo customers');

      // Create demo loans
      const loan1 = db.insert('loans', {
        customerId: customer1.id,
        loanAmount: 50000,
        principalAmount: 50000,
        interestRate: 5.5,
        loanType: 'Personal',
        status: 'Active',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2026-01-15'),
      } as any);

      const loan2 = db.insert('loans', {
        customerId: customer2.id,
        loanAmount: 100000,
        principalAmount: 100000,
        interestRate: 4.8,
        loanType: 'Business',
        status: 'Active',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2027-03-01'),
      } as any);

      console.log('[Init] Created demo loans');

      // Create demo payments
      db.insert('payments', {
        loanId: loan1.id,
        amount: 2500,
        date: new Date('2024-07-01'),
        type: 'Regular',
      } as any);

      db.insert('payments', {
        loanId: loan1.id,
        amount: 2500,
        date: new Date('2024-08-01'),
        type: 'Regular',
      } as any);

      db.insert('payments', {
        loanId: loan2.id,
        amount: 5000,
        date: new Date('2024-07-15'),
        type: 'Regular',
      } as any);

      console.log('[Init] Created demo payments');
    }

    console.log('[Init] Demo data initialization complete!');
  } catch (error) {
    console.error('[Init] Error:', error);
  }
}

initializeDemo();
