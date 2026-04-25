import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, SalesOrder, PurchaseOrder, Vendor, Unit, AccountType, PaymentTerms, ChartOfAccount, Item, GstTaxStatus, GstRate } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { UnitEditBody, AccountTypeEditBody, PaymentTermsEditBody, ChartOfAccountEditBody } from '@/services/api';

// ---------- Dashboard ----------
export const useDashboardMetrics = () => useQuery({
  queryKey: ['dashboardMetrics'],
  queryFn: apiService.getDashboardMetrics.bind(apiService),
  staleTime: 1000 * 60 * 5,
});

// ---------- Auth ----------
export const useLogin = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      apiService.login(credentials),
    onSuccess: (data) => {
      if (data.status) {
        const token = (data as any).token || (data as any).data?.token;
        const user = (data as any).user || (data as any).data?.user;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          toast({ title: 'Success', description: 'Login successful' });
        } else {
          toast({ title: 'Error', description: 'No token received from server', variant: 'destructive' });
        }
      } else {
        toast({ title: 'Error', description: data.message || 'Login failed', variant: 'destructive' });
      }
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Login failed', variant: 'destructive' });
    },
  });
};

export const useRegister = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (userData: { email: string; password: string }) =>
      apiService.register(userData),
    onSuccess: (data) => {
      if (data.status) {
        toast({ title: 'Success', description: 'Account created successfully' });
      }
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Registration failed', variant: 'destructive' });
    },
  });
};

// ---------- Units ----------
export const useUnits = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ['units', page, limit],
    queryFn: () => apiService.getUnits(page, limit),
    select: (resp) => ({
      list: resp?.data?.data ?? [],
      total: resp?.data?.total ?? 0,
    }),
  });

export const useUnit = (id?: number) => useQuery({
  queryKey: ['unit', id],
  queryFn: () => apiService.getUnit(id as number),
  enabled: typeof id === 'number',
  select: (resp: any) => resp?.data || resp,
});

export const useCreateUnit = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: Omit<Unit, 'id'>) => apiService.createUnit(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units'] });
      toast({ title: 'Success', description: 'Unit created successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to create unit', variant: 'destructive' }),
  });
};

export const useUpdateUnit = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: UnitEditBody) => apiService.updateUnit(payload),
    onSuccess: (_data, payload) => {
      qc.invalidateQueries({ queryKey: ['units'] });
      qc.invalidateQueries({ queryKey: ['unit', payload.id] });
      toast({ title: 'Success', description: 'Unit updated successfully' });
    },
  });
};

export const useDeleteUnit = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteUnit(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['units'] });
      toast({ title: res?.status ? 'Deleted' : 'Success', description: res?.message || 'Unit deleted successfully' });
    },
    onError: (err: any) =>
      toast({ title: 'Error', description: err?.message || 'Failed to delete unit', variant: 'destructive' }),
  });
};

// ---------- AccountTypes ----------
export const useAccountTypes = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ['accountTypes', page, limit],
    queryFn: () => apiService.getAccountTypes(page, limit),
    select: (resp) => ({
      list: resp?.data?.data ?? [],
      total: resp?.data?.total ?? 0,
    }),
  });

export const useAccountType = (id?: number) => useQuery({
  queryKey: ['accountType', id],
  queryFn: () => apiService.getAccountType(id as number),
  enabled: typeof id === 'number',
  select: (resp: any) => resp?.data || resp,
});

export const useCreateAccountType = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: Omit<AccountType, 'id'>) => apiService.createAccountType(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accountTypes'] });
      toast({ title: 'Success', description: 'Account Type created successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to create account type', variant: 'destructive' }),
  });
};

export const useUpdateAccountType = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: AccountTypeEditBody) => apiService.updateAccountType(payload),
    onSuccess: (_data, payload) => {
      qc.invalidateQueries({ queryKey: ['accountTypes'] });
      qc.invalidateQueries({ queryKey: ['accountType', payload.id] });
      toast({ title: 'Success', description: 'Account Type updated successfully' });
    },
  });
};

export const useDeleteAccountType = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteAccountType(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['accountTypes'] });
      toast({ title: res?.status ? 'Deleted' : 'Success', description: res?.message || 'Account Type deleted successfully' });
    },
    onError: (err: any) =>
      toast({ title: 'Error', description: err?.message || 'Failed to delete account type', variant: 'destructive' }),
  });
};

// ---------- PaymentTerms ----------
export const usePaymentTerms = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ['paymentTerms', page, limit],
    queryFn: () => apiService.getPaymentTerms(page, limit),
    select: (resp) => ({
      list: resp?.data?.payment_terms ?? [],
      total: resp?.data?.total ?? 0,
    }),
  });

export const usePaymentTerm = (id?: number) => useQuery({
  queryKey: ['paymentTerm', id],
  queryFn: () => apiService.getPaymentTerm(id as number),
  enabled: typeof id === 'number',
  select: (resp: any) => resp?.data || resp,
});

export const useCreatePaymentTerm = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: Omit<PaymentTerms, 'id'>) => apiService.createPaymentTerm(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['paymentTerms'] });
      toast({ title: 'Success', description: 'Payment Term created successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to create payment term', variant: 'destructive' }),
  });
};

export const useUpdatePaymentTerm = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: PaymentTermsEditBody) => apiService.updatePaymentTerm(payload),
    onSuccess: (_data, payload) => {
      qc.invalidateQueries({ queryKey: ['paymentTerms'] });
      qc.invalidateQueries({ queryKey: ['paymentTerm', payload.id] });
      toast({ title: 'Success', description: 'Payment Term updated successfully' });
    },
  });
};

export const useDeletePaymentTerm = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deletePaymentTerm(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['paymentTerms'] });
      toast({ title: res?.status ? 'Deleted' : 'Success', description: res?.message || 'Payment Term deleted successfully' });
    },
    onError: (err: any) =>
      toast({ title: 'Error', description: err?.message || 'Failed to delete payment term', variant: 'destructive' }),
  });
};

// ---------- ChartOfAccount ----------
export const useChartOfAccounts = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ['chartOfAccounts', page, limit],
    queryFn: () => apiService.getChartOfAccounts(page, limit),
    select: (resp) => ({
      list: resp?.data?.data ?? [],
      total: resp?.data?.total ?? 0,
    }),
  });

export const useChartOfAccount = (id?: number) => useQuery({
  queryKey: ['chartOfAccount', id],
  queryFn: () => apiService.getChartOfAccount(id as number),
  enabled: typeof id === 'number',
  select: (resp: any) => resp?.data || resp,
});

export const useCreateChartOfAccount = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: Omit<ChartOfAccount, 'id'>) => apiService.createChartOfAccount(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      toast({ title: 'Success', description: 'Chart of Account created successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to create chart of account', variant: 'destructive' }),
  });
};

export const useUpdateChartOfAccount = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: ChartOfAccountEditBody) => apiService.updateChartOfAccount(payload),
    onSuccess: (_data, payload) => {
      qc.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      qc.invalidateQueries({ queryKey: ['chartOfAccount', payload.id] });
      toast({ title: 'Success', description: 'Chart of Account updated successfully' });
    },
  });
};

export const useDeleteChartOfAccount = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteChartOfAccount(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      toast({ title: res?.status ? 'Deleted' : 'Success', description: res?.message || 'Chart of Account deleted successfully' });
    },
    onError: (err: any) =>
      toast({ title: 'Error', description: err?.message || 'Failed to delete chart of account', variant: 'destructive' }),
  });
};

// ---------- Items ----------
export const useItems = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ['items', page, limit],
    queryFn: () => apiService.getItems(page, limit),
    select: (resp) => ({
      list: resp?.data?.data ?? [],
      total: resp?.data?.total ?? 0,
    }),
  });

export const useItem = (id?: number) => useQuery({
  queryKey: ['item', id],
  queryFn: () => apiService.getItem(id as number),
  enabled: typeof id === 'number',
  select: (resp: any) => resp?.data || resp,
});

export const useCreateItem = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: Omit<Item, 'id'>) => apiService.createItem(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items'] });
      toast({ title: 'Success', description: 'Item created successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to create item', variant: 'destructive' }),
  });
};

export const useUpdateItem = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: Partial<Item> & { id: number }) => apiService.updateItem(payload),
    onSuccess: (_data, payload) => {
      qc.invalidateQueries({ queryKey: ['items'] });
      qc.invalidateQueries({ queryKey: ['item', payload.id] });
      toast({ title: 'Success', description: 'Item updated successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to update item', variant: 'destructive' }),
  });
};

export const useDeleteItem = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteItem(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['items'] });
      toast({ title: res?.status ? 'Deleted' : 'Success', description: res?.message || 'Item deleted successfully' });
    },
    onError: (err: any) =>
      toast({ title: 'Error', description: err?.message || 'Failed to delete item', variant: 'destructive' }),
  });
};

// ---------- Autocomplete Hooks ----------
export const useAccountTypeAutocomplete = () => useQuery({
  queryKey: ['accountTypeAutocomplete'],
  queryFn: apiService.getAccountTypeAutocomplete.bind(apiService),
  select: (resp: any) => resp?.data ?? [],
  staleTime: 1000 * 60 * 5,
});

export const useChartOfAccountAutocomplete = () => useQuery({
  queryKey: ['chartOfAccountAutocomplete'],
  queryFn: apiService.getChartOfAccountAutocomplete.bind(apiService),
  select: (resp: any) => resp?.data ?? [],
  staleTime: 1000 * 60 * 5,
});

export const useGstTaxStatus = () => useQuery({
  queryKey: ['gstTaxStatus'],
  queryFn: apiService.getGstTaxStatus.bind(apiService),
  select: (resp: any) => resp?.data ?? [],
  staleTime: 1000 * 60 * 10,
});

export const useGstRates = () => useQuery({
  queryKey: ['gstRates'],
  queryFn: apiService.getGstRates.bind(apiService),
  select: (resp: any) => resp?.data ?? [],
  staleTime: 1000 * 60 * 10,
});

export const useUnitAutocomplete = () => useQuery({
  queryKey: ['unitAutocomplete'],
  queryFn: apiService.getUnitAutocomplete.bind(apiService),
  select: (resp: any) => resp?.data ?? [],
  staleTime: 1000 * 60 * 10,
});

export const useVendorAutocomplete = () => useQuery({
  queryKey: ['vendorAutocomplete'],
  queryFn: apiService.getVendorAutocomplete.bind(apiService),
  select: (resp: any) => resp?.data ?? [],
  staleTime: 1000 * 60 * 5,
});

export const usePaymentTermAutocomplete = (enabled: boolean = true) => useQuery({
  queryKey: ['paymentTermAutocomplete'],
  queryFn: apiService.getPaymentTermAutocomplete.bind(apiService),
  select: (resp: any) => resp?.data ?? [],
  enabled,
  staleTime: 1000 * 60 * 5,
});

export const useItemAutocomplete = (enabled: boolean = true) => useQuery({
  queryKey: ['itemAutocomplete'],
  queryFn: apiService.getItemAutocomplete.bind(apiService),
  select: (resp: any) => resp?.data ?? [],
  enabled,
  staleTime: 1000 * 60 * 5,
});

export const useCustomerAutocomplete = () => useQuery({
  queryKey: ['customerAutocomplete'],
  queryFn: apiService.getCustomerAutocomplete.bind(apiService),
  select: (resp: any) => resp?.data ?? [],
  staleTime: 1000 * 60 * 5,
});

// ---------- Customers ----------
export const useCustomers = (page: number = 1, limit: number = 10) => useQuery({
  queryKey: ['customers', page, limit],
  queryFn: () => apiService.getCustomers(page, limit),
  select: (resp) => {
    const list = (resp as any)?.data?.data || (resp as any)?.data?.customers || (resp as any)?.data?.rows || [];
    return {
      list: list,
      total: resp?.data?.total ?? list.length ?? 0,
    };
  },
});

export const useCustomer = (id?: number) => useQuery({
  queryKey: ['customer', id],
  queryFn: () => apiService.getCustomer(id as number),
  enabled: !!id,
  select: (resp: any) => resp?.data || resp,
});

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (customerData: any) => apiService.createCustomer(customerData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Success', description: 'Customer created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create customer', variant: 'destructive' });
    },
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (customerData: any) => apiService.updateCustomer(customerData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      qc.invalidateQueries({ queryKey: ['customer'] });
      toast({ title: 'Success', description: 'Customer updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update customer', variant: 'destructive' });
    },
  });
};

export const useDeleteCustomer = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteCustomer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Success', description: 'Customer deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete customer', variant: 'destructive' });
    },
  });
};

// ---------- Vendors ----------
export const useVendors = (page: number = 1, limit: number = 10) => useQuery({
  queryKey: ['vendors', page, limit],
  queryFn: () => apiService.getVendors(page, limit),
  select: (resp) => ({
    list: (resp as any)?.data?.data || (resp as any)?.data?.vendors || [],
    total: resp?.data?.total ?? 0,
  }),
});

export const useCreateVendor = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (vendorData: Vendor) => apiService.createVendor(vendorData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vendors'] });
      toast({ title: 'Success', description: 'Vendor created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create vendor', variant: 'destructive' });
    },
  });
};

export const useUpdateVendor = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (vendorData: any) => apiService.updateVendor(vendorData.id, vendorData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vendors'] });
      toast({ title: 'Success', description: 'Vendor updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update vendor', variant: 'destructive' });
    },
  });
};

// ---------- Purchase Orders ----------
export const usePurchaseOrders = (page: number = 1, limit: number = 10) => useQuery({
  queryKey: ['purchaseOrders', page, limit],
  queryFn: () => apiService.getPurchaseOrders(page, limit),
  select: (resp) => ({
    list: resp?.data?.data ?? [],
    total: resp?.data?.total ?? 0,
  }),
  staleTime: 1000 * 60 * 5,
});

export const usePurchaseOrder = (id?: number | string) => useQuery({
  queryKey: ['purchaseOrder', id],
  queryFn: () => apiService.getPurchaseOrder(id as any),
  enabled: !!id,
  select: (resp: any) => resp?.data || resp,
});

export const useCreatePurchaseOrder = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (order: any) => apiService.createPurchaseOrder(order),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchaseOrders'] });
      toast({ title: 'Success', description: 'Purchase order created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to create purchase order', variant: 'destructive' });
    },
  });
};

export const useUpdatePurchaseOrder = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, order }: { id: string | number; order: Partial<PurchaseOrder> }) =>
      apiService.updatePurchaseOrder({ id, ...order }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchaseOrders'] });
      qc.invalidateQueries({ queryKey: ['purchaseOrder'] });
      toast({ title: 'Success', description: 'Purchase order updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to update purchase order', variant: 'destructive' });
    },
  });
};

export const useDeletePurchaseOrder = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deletePurchaseOrder(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['purchaseOrders'] });
      toast({ title: 'Success', description: res?.message || 'Purchase order deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete purchase order', variant: 'destructive' });
    },
  });
};

// ---------- Quotations ----------
export const useQuotes = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ['quotes', page, limit],
    queryFn: () => apiService.getQuotations(page, limit),
    select: (resp) => ({
      list: resp?.data?.data ?? [],
      total: resp?.data?.total ?? 0,
    }),
  });

export const useQuote = (id?: number) => useQuery({
  queryKey: ['quote', id],
  queryFn: () => apiService.getQuotation(id as number),
  enabled: typeof id === 'number',
  select: (resp: any) => resp?.data || resp,
});

export const useCreateQuote = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: any) => apiService.createQuotation(payload),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['quotes'] });
      toast({ title: 'Success', description: res?.message || 'Quotation created successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to create quotation', variant: 'destructive' }),
  });
};

export const useUpdateQuote = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: any) => apiService.updateQuotation(payload),
    onSuccess: (res, payload) => {
      qc.invalidateQueries({ queryKey: ['quotes'] });
      qc.invalidateQueries({ queryKey: ['quote', payload.id] });
      toast({ title: 'Success', description: res?.message || 'Quotation updated successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to update quotation', variant: 'destructive' }),
  });
};

export const useDeleteQuote = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteQuotation(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['quotes'] });
      toast({ title: res?.status ? 'Deleted' : 'Success', description: res?.message || 'Quotation deleted successfully' });
    },
    onError: (err: any) =>
      toast({ title: 'Error', description: err?.message || 'Failed to delete quotation', variant: 'destructive' }),
  });
};

// ---------- Sales Orders ----------
export const useSalesOrders = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ['sales_orders', page, limit],
    queryFn: () => apiService.getSalesOrders(page, limit),
    select: (resp) => ({
      list: resp?.data?.data ?? [],
      total: resp?.data?.total ?? 0,
    }),
  });

export const useSalesOrder = (id?: number) => useQuery({
  queryKey: ['sales_order', id],
  queryFn: () => apiService.getSalesOrder(id as number),
  enabled: typeof id === 'number',
  select: (resp: any) => resp?.data || resp,
});

export const useCreateSalesOrder = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: any) => apiService.createSalesOrder(payload),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['sales_orders'] });
      toast({ title: 'Success', description: res?.message || 'Sales Order created successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to create sales order', variant: 'destructive' }),
  });
};

export const useUpdateSalesOrder = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: any) => apiService.updateSalesOrder(payload),
    onSuccess: (res, payload) => {
      qc.invalidateQueries({ queryKey: ['sales_orders'] });
      qc.invalidateQueries({ queryKey: ['sales_order', payload.id] });
      toast({ title: 'Success', description: res?.message || 'Sales Order updated successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to update sales order', variant: 'destructive' }),
  });
};

export const useDeleteSalesOrder = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteSalesOrder(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['sales_orders'] });
      toast({ title: res?.status ? 'Deleted' : 'Success', description: res?.message || 'Sales Order deleted successfully' });
    },
    onError: (err: any) =>
      toast({ title: 'Error', description: err?.message || 'Failed to delete sales order', variant: 'destructive' }),
  });
};

// ---------- Invoices ----------
export const useInvoices = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ['invoices', page, limit],
    queryFn: () => apiService.getInvoices(page, limit),
    select: (resp) => ({
      list: resp?.data?.data ?? [],
      total: resp?.data?.total ?? 0,
    }),
  });

export const useInvoice = (id?: number) => useQuery({
  queryKey: ['invoice', id],
  queryFn: () => apiService.getInvoice(id as number),
  enabled: typeof id === 'number',
  select: (resp: any) => resp?.data || resp,
});

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: any) => apiService.createInvoice(payload),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: 'Success', description: res?.message || 'Invoice created successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to create invoice', variant: 'destructive' }),
  });
};

export const useUpdateInvoice = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: any) => apiService.updateInvoice(payload),
    onSuccess: (res, payload) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['invoice', payload.id] });
      toast({ title: 'Success', description: res?.message || 'Invoice updated successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to update invoice', variant: 'destructive' }),
  });
};

export const useDeleteInvoice = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteInvoice(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: res?.status ? 'Deleted' : 'Success', description: res?.message || 'Invoice deleted successfully' });
    },
    onError: (err: any) =>
      toast({ title: 'Error', description: err?.message || 'Failed to delete invoice', variant: 'destructive' }),
  });
};

// ---------- Payments Received ----------
export const usePaymentsReceived = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ['payments-received', page, limit],
    queryFn: () => apiService.getPaymentsReceived(page, limit),
    select: (resp) => ({
      list: resp?.data?.data ?? [],
      total: resp?.data?.total ?? 0,
    }),
  });

export const usePaymentReceived = (id?: number) => useQuery({
  queryKey: ['payment-received', id],
  queryFn: () => apiService.getPaymentReceived(id as number),
  enabled: typeof id === 'number',
  select: (resp: any) => resp?.data || resp,
});

export const useCreatePaymentReceived = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: any) => apiService.createPaymentReceived(payload),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['payments-received'] });
      toast({ title: 'Success', description: res?.message || 'Payment recorded successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to record payment', variant: 'destructive' }),
  });
};

export const useUpdatePaymentReceived = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: any) => apiService.updatePaymentReceived(payload),
    onSuccess: (res, payload) => {
      qc.invalidateQueries({ queryKey: ['payments-received'] });
      qc.invalidateQueries({ queryKey: ['payment-received', payload.id] });
      toast({ title: 'Success', description: res?.message || 'Payment updated successfully' });
    },
    onError: (err: Error) =>
      toast({ title: 'Error', description: err?.message || 'Failed to update payment', variant: 'destructive' }),
  });
};

export const useDeletePaymentReceived = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => apiService.deletePaymentReceived(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['payments-received'] });
      toast({ title: res?.status ? 'Deleted' : 'Success', description: res?.message || 'Payment deleted successfully' });
    },
    onError: (err: any) =>
      toast({ title: 'Error', description: err?.message || 'Failed to delete payment', variant: 'destructive' }),
  });
};

export const useCustomerInvoices = (customerId?: number) => useQuery({
  queryKey: ['customer-invoices', customerId],
  queryFn: () => apiService.getCustomerInvoices(customerId as number),
  enabled: typeof customerId === 'number',
  select: (resp: any) => resp?.data?.data || [],
});
