'use client';

import { useState, useEffect } from 'react';
import { getPayments, createPayment, getLoans, getCustomers } from '@/app/actions/finance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, DollarSign, Calendar } from 'lucide-react';

interface Loan {
  id: string;
  customerId: string;
  loanAmount: number;
}

interface Customer {
  id: string;
  name: string;
}

interface Payment {
  id: string;
  loanId: string;
  amount: number;
  date: Date | number;
  type: string;
  createdAt: Date | number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    loanId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Regular',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [paymentList, loanList, customerList] = await Promise.all([
      getPayments(),
      getLoans(),
      getCustomers(),
    ]);
    setPayments(paymentList);
    setLoans(loanList);
    setCustomers(customerList);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createPayment(
      formData.loanId,
      parseFloat(formData.amount),
      new Date(formData.date),
      formData.type
    );

    if (result.success) {
      setFormData({
        loanId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Regular',
      });
      setIsOpen(false);
      await loadData();
    }
  };

  const getCustomerNameForLoan = (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return 'Unknown';
    return customers.find((c) => c.id === loan.customerId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments & Collections</h1>
          <p className="text-slate-600">Track all loan payments and collections</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>Enter payment details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Loan</label>
                <select
                  required
                  value={formData.loanId}
                  onChange={(e) => setFormData({ ...formData, loanId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a loan</option>
                  {loans.map((loan) => (
                    <option key={loan.id} value={loan.id}>
                      {getCustomerNameForLoan(loan.id)} - ${loan.loanAmount.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Date</label>
                <Input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option>Regular</option>
                  <option>Partial</option>
                  <option>Full</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Record Payment</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-600">Loading...</p>
        </div>
      ) : payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-slate-600 mb-4">No payments recorded yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Payment Date</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Recorded Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">{getCustomerNameForLoan(payment.loanId)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      {payment.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      payment.type === 'Full' ? 'bg-green-100 text-green-800' :
                      payment.type === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {payment.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      {new Date(payment.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
