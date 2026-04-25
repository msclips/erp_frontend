// // // API service for communicating with MongoDB backend
// import { config } from '../config/env';

//   const API_BASE_URL = '/api';


// interface SalesOrder {
//   id: string;
//   customer: string;
//   date: string;
//   amount: number;
//   status: string;
//   items: number;
// }

// interface PurchaseOrder {
//   id: string;
//   vendor: string;
//   date: string;
//   amount: number;
//   status: string;
//   items: number;
//   dueDate: string;
// }


// interface Unit {
//   id: number;
//   name: string;
//   description: string | null;

// }
// interface Vendor {
//   id: number;
//   saluation: number;
//   first_name: string;
//   last_name: string;
//   company_name: string;
//   display_name: string;
//   email: string;
//   phone: number;
//   pan: string | null;
//   msme_register: boolean;
//   msme_register_type: number;
//   msme_register_number: string | null;
//   opening_balance: string | null;
//   currency: string | null;
//   vendor_id: string | null;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
// }



// interface ListResponse<T> {
//   status?: boolean;
//   code?: number;
//   message?: string;
//   data?: T;
// }

// class ApiService {


//    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
//     try {
//       const token = localStorage.getItem('token') || '';

//       const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           // ➕ include Authorization header for protected routes
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         ...options,
//       });

//       if (!response.ok) {
//         // Try to surface backend error message if available
//         let message = `HTTP error! status: ${response.status}`;
//         try {
//           const errJson = await response.json();
//           if (errJson?.message) message = errJson.message;
//         } catch {
//         throw new Error(message);
//         }
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('API request failed:', error);
//       throw error;
//     }
//   }



//   async getSalesOrders(): Promise<SalesOrder[]> {
//     return this.request<SalesOrder[]>('/sales');
//   }

//   async getSalesOrder(id: string): Promise<SalesOrder> {
//     return this.request<SalesOrder>(`/sales/${id}`);
//   }

//   async createSalesOrder(order: Omit<SalesOrder, 'id'>): Promise<SalesOrder> {
//     return this.request<SalesOrder>('/sales', {
//       method: 'POST',
//       body: JSON.stringify(order),
//     });
//   }

//   async updateSalesOrder(id: string, order: Partial<SalesOrder>): Promise<SalesOrder> {
//     return this.request<SalesOrder>(`/sales/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(order),
//     });
//   }

//   async deleteSalesOrder(id: string): Promise<void> {
//     return this.request<void>(`/sales/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   // Purchase Orders
//   async getPurchaseOrders(): Promise<PurchaseOrder[]> {
//     return this.request<PurchaseOrder[]>('/purchases');
//   }

//   async getPurchaseOrder(id: string): Promise<PurchaseOrder> {
//     return this.request<PurchaseOrder>(`/purchases/${id}`);
//   }

//   async createPurchaseOrder(order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
//     return this.request<PurchaseOrder>('/purchases', {
//       method: 'POST',
//       body: JSON.stringify(order),
//     });
//   }

//   async updatePurchaseOrder(id: string, order: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
//     return this.request<PurchaseOrder>(`/purchases/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(order),
//     });
//   }

//   async deletePurchaseOrder(id: string): Promise<void> {
//     return this.request<void>(`/purchases/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   // Dashboard metrics
//   async getDashboardMetrics() {
//     return this.request<any>('/dashboard/metrics');
//   }


// //unit endpoints
//     async getUnits(page: number = 1, limit: number = 10) {
//       return this.request<{
//         status: boolean;
//         code: number;
//         message: string;
//         data: {
//           total: number;
//           page: number;
//           limit: number;
//           units: Unit[];
//         };
//       }>(`/unit/list?page=${page}&limit=${limit}`, {
//         method: 'GET',
//       });
//     }



//   // Vendor endpoints
//   async getVendors(page: number = 1, limit: number = 10) {
//     return this.request<{
//       status: boolean;
//       code: number;
//       message: string;
//       data: {
//         total: number;
//         page: number;
//         limit: number;
//         vendors: Vendor[];
//       };
//     }>(`/vendor/list?page=${page}&limit=${limit}`, {
//       method: 'GET',

//     });
//   }

//   async createVendor(vendorData: any) {
//     return this.request<any>('/api/vendor/create', {
//       method: 'POST',
//       body: JSON.stringify(vendorData),
//     });
//   }

//   async updateVendor(id: number, vendorData: any) {
//     return this.request<any>(`/api/vendor/update/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(vendorData),
//     });
//   }
// }



// export const apiService = new ApiService();
// export type { SalesOrder, PurchaseOrder, Vendor, Unit };






// // API service for communicating with MongoDB backend
import { config } from '../config/env';

const API_BASE_URL = config.api.baseUrl;

interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
  items: number;
}

interface PurchaseOrder {
  id: number;
  vendor_id: number;
  purchase_order_no: string;
  date: string; // purchase_order_date in api? response says purchase_order_date: "2025-11-23"
  purchase_order_date: string;
  amount: number; // response doesn't show amount explicitly in the brief snippet but likely there? User snippet didn't show it but previous code used it. I will keep it optional or check.
  // The user snippet shows: id, vendor_id, payment_terms_id, purchase_order_no, createdAt, ...
  // It does NOT show 'amount' in the top level keys provided.
  // I will add purchase_order_no.
  status?: string; // Not in snippet but likely needed
  items?: number; // Not in snippet
  dueDate?: string; // Not in snippet
}
export type UnitEditBody = {
  id: number;
  name?: string;
  description?: string | null;
};

export type AccountTypeEditBody = {
  id: number;
  name?: string;
};

export type PaymentTermsEditBody = {
  id: number;
  term?: string;
  condition?: string;
};

export type ChartOfAccountEditBody = {
  id: number;
  account_type_id?: number;
  name?: string;
};

type UnitListResponse = {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: Unit[]; // <-- array is named `data`
  };
};

type AccountTypeListResponse = {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: AccountType[];
  };
};

type PaymentTermsListResponse = {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    payment_terms: PaymentTerms[];
  };
};

type ChartOfAccountListResponse = {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: ChartOfAccount[];
  };
};

type CustomerListResponse = {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: Customer[];
  };
};

type ItemListResponse = {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: Item[];
  };
};


interface Unit {
  id: number;                 // keep number to match your backend
  name: string;
  description: string | null;
}

interface AccountType {
  id: number;
  name: string;
}

interface PaymentTerms {
  id: number;
  term: string;
  condition: string;
}

interface ChartOfAccount {
  id: number;
  account_type_id: number;
  name: string;
  created_by_id: number | null;
  updated_by_id: number | null;
  deleted_by_id: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  account_type?: AccountType;
}

interface Item {
  id: number;
  name: string;
  code: string;
  sac_code?: string;
  unit_id?: number;
  type: number; // 1 for GOODS, 2 for SERVICE
  purchase_price?: number;
  selling_price: number;
  mrp?: number;
  opening_stock?: number;
  opening_stock_value?: number;
  minimum_stock_level?: number;
  description?: string;
  tax_status?: number;
  gst_rate?: number;
  service_rate?: number;
  warranty_period?: string;
  created_by_id?: number | null;
  updated_by_id?: number | null;
  deleted_by_id?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  unit?: {
    id: number;
    name: string;
    description?: string;
  };
}

interface GstTaxStatus {
  id: number;
  name: string;
}

interface GstRate {
  id: number;
  name: string;
}

interface Vendor {
  id: number;
  saluation: number;
  first_name: string;
  last_name: string;
  company_name: string;
  display_name: string;
  email: string;
  phone: number;
  pan: string | null;
  msme_register: boolean;
  msme_register_type: number;
  msme_register_number: string | null;
  opening_balance: string | null;
  currency: string | null;
  vendor_id: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ContactPerson {
  first_name: string;
  last_name: string;
  email?: string;
  work_phone?: string;
}

interface Customer {
  id: number;
  display_name: string;
  customer_type: number;
  company_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  status?: string;
  total_value?: number;
  avatar?: string;
  contact_person?: ContactPerson[];
  createdAt?: string;
  updatedAt?: string;
}

interface ListResponse<T> {
  status?: boolean;
  code?: number;
  message?: string;
  data?: T;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const token = localStorage.getItem('token') || '';
      const fullUrl = `${API_BASE_URL}${endpoint}`;

      console.log('🔥 API Service: Making request to:', fullUrl);
      console.log('🔥 API Service: Request options:', options);
      console.log('🔥 API Service: Token present:', !!token);
      console.log('🔥 API Service: Token value:', token ? `${token.substring(0, 20)}...` : 'No token');

      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...options,
      });

      console.log('🔥 API Service: Response status:', response.status);
      console.log('🔥 API Service: Response ok:', response.ok);
      console.log('🔥 API Service: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        // ✅ always throw after trying to read server message
        let message = `HTTP error! status: ${response.status}`;
        try {
          const errJson = await response.json();
          console.log('🔥 API Service: Error response:', errJson);
          if (errJson?.message) message = errJson.message;

          // Check for invalid token and redirect
          if (message === "Invalid token.") {
            console.log('🔥 API Service: Invalid token detected (4xx). Redirecting to auth...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth';
            throw new Error("Session expired. Redirecting to login...");
          }
        } catch (parseError) {
          console.log('🔥 API Service: Could not parse error response:', parseError);
          // Try to get response text if JSON parsing fails
          try {
            const errorText = await response.text();
            console.log('🔥 API Service: Error response text:', errorText);
            if (errorText) message = errorText;
          } catch {
            // Ignore if we can't get text either
          }
        }
        throw new Error(message);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      console.log('🔥 API Service: Response content-type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        console.log('🔥 API Service: Non-JSON response, getting text');
        const text = await response.text();
        console.log('🔥 API Service: Response text:', text);
        throw new Error('Expected JSON response but got: ' + contentType);
      }

      const result = await response.json();

      // Check for invalid token in success response (if backend returns 200 for this error)
      // The user specified: {success: false, message: "Invalid token."}
      if (result && result.message === "Invalid token.") {
        console.log('🔥 API Service: Invalid token detected (200 OK). Redirecting to auth...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        throw new Error("Session expired. Redirecting to login...");
      }

      console.log('🔥 API Service: Response data:', result);
      return result;
    } catch (error) {
      console.error('🔥 API Service: Request failed:', error);
      throw error;
    }
  }

  // ---------- Purchases ----------
  async getPurchaseOrders(page: number = 1, limit: number = 10): Promise<{
    status: boolean;
    code: number;
    message: string;
    data: {
      total: number;
      page: number;
      limit: number;
      data: PurchaseOrder[];
    };
  }> {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: {
        total: number;
        page: number;
        limit: number;
        data: PurchaseOrder[];
      };
    }>(`/purchaseorder/datatable?page=${page}&limit=${limit}`);
  }
  async getPurchaseOrder(id: string | number): Promise<PurchaseOrder> {
    const result = await this.request<any>(`/purchaseorder/show/${id}`, { method: 'GET' });
    return result?.data || result;
  }
  async createPurchaseOrder(order: any): Promise<PurchaseOrder> {
    return this.request<PurchaseOrder>('/purchaseorder/store', { method: 'POST', body: JSON.stringify(order) });
  }
  async updatePurchaseOrder(payload: any): Promise<PurchaseOrder> {
    return this.request<PurchaseOrder>('/purchaseorder/update', { method: 'POST', body: JSON.stringify(payload) });
  }
  async deletePurchaseOrder(id: number): Promise<{ status: boolean; message: string }> {
    return this.request<{ status: boolean; message: string }>(`/purchaseorder/delete/${id}`, { method: 'DELETE' });
  }

  // ---------- Dashboard ----------
  async getDashboardMetrics() {
    return this.request<any>('/dashboard/metrics');
  }

  // ---------- Units (NEW) ----------
  // List (paginated wrapper)
  async getUnits(page: number = 1, limit: number = 10) {
    return this.request<UnitListResponse>(`/unit/datatable?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }
  // Get single (adjust path if your backend differs, e.g. `/unit/${id}`)
  async getUnit(id: number): Promise<Unit> {
    return this.request<Unit>(`/unit/detail/${id}`, { method: 'GET' });
  }

  async createUnit(payload: Omit<Unit, 'id'>): Promise<Unit> {
    return this.request<Unit>('/unit/store', { method: 'POST', body: JSON.stringify(payload) });
  }

  // async updateUnit(id: number, payload: Partial<Unit>): Promise<Unit> {
  //   return this.request<Unit>(`/unit/edit${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  // }
  async updateUnit(payload: UnitEditBody): Promise<Unit> {
    return this.request<Unit>('/unit/update', {
      method: 'PUT',          // or 'POST' if your backend expects it
      body: JSON.stringify(payload),  // <-- { id, unit: { ... } }
    });
  }
  async deleteUnit(id: number): Promise<{ status?: boolean; message?: string }> {
    return this.request<{ status?: boolean; message?: string }>(`/unit/delete/${id}`, { method: 'DELETE' });
  }

  // ---------- AccountType ----------
  async getAccountTypes(page: number = 1, limit: number = 10) {
    return this.request<AccountTypeListResponse>(`/accounttype/datatable?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async getAccountType(id: number): Promise<AccountType> {
    return this.request<AccountType>(`/accounttype/detail/${id}`, { method: 'GET' });
  }

  async createAccountType(payload: Omit<AccountType, 'id'>): Promise<AccountType> {
    return this.request<AccountType>('/accounttype/store', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateAccountType(payload: AccountTypeEditBody): Promise<AccountType> {
    return this.request<AccountType>('/accounttype/update', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteAccountType(id: number): Promise<{ status?: boolean; message?: string }> {
    return this.request<{ status?: boolean; message?: string }>(`/accounttype/delete/${id}`, { method: 'DELETE' });
  }

  // ---------- PaymentTerms ----------
  async getPaymentTerms(page: number = 1, limit: number = 10) {
    return this.request<PaymentTermsListResponse>(`/paymentterm/datatable?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async getPaymentTerm(id: number): Promise<PaymentTerms> {
    return this.request<PaymentTerms>(`/paymentterm/detail/${id}`, { method: 'GET' });
  }

  async createPaymentTerm(payload: Omit<PaymentTerms, 'id'>): Promise<PaymentTerms> {
    return this.request<PaymentTerms>('/paymentterm/store', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updatePaymentTerm(payload: PaymentTermsEditBody): Promise<PaymentTerms> {
    return this.request<PaymentTerms>('/paymentterm/update', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deletePaymentTerm(id: number): Promise<{ status?: boolean; message?: string }> {
    return this.request<{ status?: boolean; message?: string }>(`/paymentterm/delete/${id}`, { method: 'DELETE' });
  }

  // ---------- ChartOfAccount ----------
  async getChartOfAccounts(page: number = 1, limit: number = 10) {
    return this.request<ChartOfAccountListResponse>(`/chartofaccount/datatable?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async getChartOfAccount(id: number): Promise<ChartOfAccount> {
    return this.request<ChartOfAccount>(`/chartofaccount/detail/${id}`, { method: 'GET' });
  }

  async createChartOfAccount(payload: Omit<ChartOfAccount, 'id'>): Promise<ChartOfAccount> {
    return this.request<ChartOfAccount>('/chartofaccount/store', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateChartOfAccount(payload: ChartOfAccountEditBody): Promise<ChartOfAccount> {
    return this.request<ChartOfAccount>('/chartofaccount/update', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteChartOfAccount(id: number): Promise<{ status?: boolean; message?: string }> {
    return this.request<{ status?: boolean; message?: string }>(`/chartofaccount/delete/${id}`, { method: 'DELETE' });
  }

  // ---------- Items ----------
  async getItems(page: number = 1, limit: number = 10) {
    return this.request<ItemListResponse>(`/item/datatable?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async getItem(id: number): Promise<Item> {
    return this.request<Item>(`/item/detail/${id}`, { method: 'GET' });
  }

  async createItem(payload: Omit<Item, 'id'>): Promise<Item> {
    console.log('🔥 API Service: createItem called with payload:', payload);
    const result = await this.request<any>('/item/store', { method: 'POST', body: JSON.stringify(payload) });
    console.log('🔥 API Service: createItem raw response:', result);

    // Handle different response structures
    if (result && result.data) {
      console.log('🔥 API Service: Extracting data from response.data:', result.data);
      return result.data;
    } else if (result && result.item) {
      console.log('🔥 API Service: Extracting data from response.item:', result.item);
      return result.item;
    } else if (result && result.status && result.data) {
      console.log('🔥 API Service: Extracting data from response.data (with status):', result.data);
      return result.data;
    } else {
      console.log('🔥 API Service: Using response directly:', result);
      return result;
    }
  }

  async updateItem(payload: Partial<Item> & { id: number }): Promise<Item> {
    return this.request<Item>('/item/update', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteItem(id: number): Promise<{ status?: boolean; message?: string }> {
    return this.request<{ status?: boolean; message?: string }>(`/item/delete/${id}`, { method: 'DELETE' });
  }

  // ---------- Vendors ----------
  async getVendors(page: number = 1, limit: number = 10) {
    console.log('🔥 API Service: getVendors called with page:', page, 'limit:', limit);
    const result = await this.request<{
      status: boolean;
      code: number;
      message: string;
      data: { total: number; page: number; limit: number; data: Vendor[] };
    }>(`/vendor/datatable?page=${page}&limit=${limit}`, { method: 'GET' });
    console.log('🔥 API Service: getVendors response:', result);
    return result;
  }


  async createVendor(vendorData: any) {
    console.log('🔥 API Service: createVendor called with:', vendorData);
    const result = await this.request<any>('/vendor/store', { method: 'POST', body: JSON.stringify(vendorData) });
    console.log('🔥 API Service: createVendor response:', result);
    return result;
  }
  async updateVendor(id: number, vendorData: any) {
    console.log('🔥 API Service: updateVendor called with id:', id, 'vendorData:', vendorData);
    const result = await this.request<any>('/vendor/update', {
      method: 'PUT',
      body: JSON.stringify(vendorData)
    });
    console.log('🔥 API Service: updateVendor response:', result);
    return result;
  }

  // ---------- Customers ----------
  async getCustomers(page: number = 1, limit: number = 10) {
    return this.request<CustomerListResponse>(`/customer/datatable?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async getCustomer(id: number): Promise<Customer> {
    const result = await this.request<any>(`/customer/show/${id}`, { method: 'GET' });
    return result?.data || result;
  }

  async createCustomer(customerData: any) {
    return this.request<any>('/customer/store', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(customerData: any) {
    return this.request<any>('/customer/update', {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(id: number): Promise<{ status?: boolean; message?: string }> {
    return this.request<{ status?: boolean; message?: string }>(`/customer/delete/${id}`, {
      method: 'DELETE',
    });
  }

  async getCustomerAutocomplete() {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: Customer[];
    }>('/customer/autocomplete', { method: 'GET' });
  }

  async getCustomerInvoices(customerId: number) {
    return this.request<any>(`/invoice/customer/${customerId}`, { method: 'GET' });
  }

  // ---------- Auth ----------
  async login(credentials: { username: string; password: string }) {
    return this.request<{
      status: boolean;
      message: string;
      token: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { email: string; password: string }) {
    return this.request<{
      status: boolean;
      message: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // ---------- AccountType Autocomplete for ChartOfAccount ----------
  async getAccountTypeAutocomplete() {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: AccountType[];
    }>('/accounttype/autocomplete', { method: 'GET' });
  }

  // ---------- ChartOfAccount Autocomplete ----------
  async getChartOfAccountAutocomplete() {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: ChartOfAccount[];
    }>('/chartofaccount/autocomplete', { method: 'GET' });
  }

  // ---------- GST Configuration ----------
  async getGstTaxStatus() {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: GstTaxStatus[];
    }>('/gstconfiguration/tax-status', { method: 'GET' });
  }

  async getGstRates() {
    console.log('🔥 API Service: getGstRates called');
    console.log('🔥 API Service: Base URL:', API_BASE_URL);
    console.log('🔥 API Service: Full URL:', `${API_BASE_URL}/gstconfiguration/gst-rate`);
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: GstRate[];
    }>('/gstconfiguration/gst-rate', { method: 'GET' });
  }

  // ---------- Unit Autocomplete ----------
  async getUnitAutocomplete() {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: Unit[];
    }>('/unit/autocomplete', { method: 'GET' });
  }

  // ---------- Vendor Autocomplete ----------
  async getVendorAutocomplete() {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: Vendor[];
    }>('/vendor/autocomplete', { method: 'GET' });
  }

  // ---------- Payment Term Autocomplete ----------
  async getPaymentTermAutocomplete() {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: { id: number; term: string; condition: string }[];
    }>('/paymentterm/autocomplete', { method: 'GET' });
  }

  // ---------- Item Autocomplete ----------
  async getItemAutocomplete() {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: Item[];
    }>('/item/autocomplete', { method: 'GET' });
  }

  // ---------- Quotations ----------
  async getQuotations(page: number = 1, limit: number = 10) {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: { total: number; page: number; limit: number; data: any[] };
    }>(`/quotation/datatable?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  async getQuotation(id: number) {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: any;
    }>(`/quotation/show/${id}`, { method: 'GET' });
  }

  async createQuotation(payload: any) {
    return this.request<any>('/quotation/store', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateQuotation(payload: any) {
    return this.request<any>('/quotation/update', { method: 'PUT', body: JSON.stringify(payload) });
  }

  async deleteQuotation(id: number) {
    return this.request<any>(`/quotation/delete/${id}`, { method: 'DELETE' });
  }

  // ---------- Sales Orders ----------
  async getSalesOrders(page: number = 1, limit: number = 10) {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: { total: number; page: number; limit: number; data: any[] };
    }>(`/salesorder/datatable?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  async getSalesOrder(id: number) {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: any;
    }>(`/salesorder/show/${id}`, { method: 'GET' });
  }

  async createSalesOrder(payload: any) {
    return this.request<any>('/salesorder/store', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateSalesOrder(payload: any) {
    return this.request<any>('/salesorder/update', { method: 'PUT', body: JSON.stringify(payload) });
  }

  async deleteSalesOrder(id: number) {
    return this.request<any>(`/salesorder/delete/${id}`, { method: 'DELETE' });
  }

  // ---------- Invoices ----------
  async getInvoices(page: number = 1, limit: number = 10) {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: { total: number; page: number; limit: number; data: any[] };
    }>(`/invoice/datatable?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  async getInvoice(id: number) {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: any;
    }>(`/invoice/show/${id}`, { method: 'GET' });
  }

  async createInvoice(payload: any) {
    return this.request<any>('/invoice/store', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateInvoice(payload: any) {
    return this.request<any>('/invoice/update', { method: 'POST', body: JSON.stringify(payload) });
  }

  async deleteInvoice(id: number) {
    return this.request<any>(`/invoice/delete/${id}`, { method: 'GET' });
  }

  // ---------- Payments Received ----------
  async getPaymentsReceived(page: number = 1, limit: number = 10) {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: { total: number; page: number; limit: number; data: any[] };
    }>(`/payment-received/datatable?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  async getPaymentReceived(id: number) {
    return this.request<{
      status: boolean;
      code: number;
      message: string;
      data: any;
    }>(`/payment-received/show/${id}`, { method: 'GET' });
  }

  async createPaymentReceived(payload: any) {
    return this.request<any>('/payment-received/store', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updatePaymentReceived(payload: any) {
    return this.request<any>('/payment-received/update', { method: 'POST', body: JSON.stringify(payload) });
  }

  async deletePaymentReceived(id: number) {
    return this.request<any>(`/payment-received/delete/${id}`, { method: 'GET' });
  }

}

export const apiService = new ApiService();
export type { SalesOrder, PurchaseOrder, Vendor, Unit, AccountType, PaymentTerms, ChartOfAccount, Item, GstTaxStatus, GstRate };
