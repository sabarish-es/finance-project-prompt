'use client';

import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer } from '@/app/actions/finance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  address?: string;
  createdAt: Date | number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    address: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const data = await getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const result = await updateCustomer(
        editingId,
        formData.name,
        formData.email,
        formData.phone,
        formData.location,
        formData.address
      );
      if (result.success) {
        setEditingId(null);
        setFormData({ name: '', email: '', phone: '', location: '', address: '' });
        setIsOpen(false);
        await loadCustomers();
      }
    } else {
      const result = await createCustomer(
        formData.name,
        formData.email,
        formData.phone,
        formData.location,
        formData.address
      );
      if (result.success) {
        setFormData({ name: '', email: '', phone: '', location: '', address: '' });
        setIsOpen(false);
        await loadCustomers();
      }
    }
  };

  const handleEdit = (customer: Customer) => {
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      location: customer.location || '',
      address: customer.address || '',
    });
    setEditingId(customer.id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', location: '', address: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-slate-600">Manage your loan customers</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setFormData({ name: '', email: '', phone: '', location: '', address: '' }); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Update customer information' : 'Enter the details for a new customer'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-600">Loading...</p>
        </div>
      ) : customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-slate-600 mb-4">No customers yet</p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingId(null); setFormData({ name: '', email: '', phone: '', location: '', address: '' }); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Customer
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>{customer.name}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(customer)} className="p-1 hover:bg-slate-100 rounded">
                      <Edit2 className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.location}</span>
                  </div>
                )}
                {customer.address && (
                  <p className="text-sm text-slate-600 mt-2">{customer.address}</p>
                )}
                <Link href={`/dashboard/loans?customerId=${customer.id}`}>
                  <Button variant="outline" className="w-full mt-4">View Loans</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
