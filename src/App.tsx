import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Customers from "./pages/sales/Customers";
import Quotes from "./pages/sales/Quotes";
import SalesOrders from "./pages/sales/SalesOrders";
import Invoices from "./pages/sales/Invoices";
import RecurringInvoices from "./pages/sales/RecurringInvoices";
import DeliveryChallans from "./pages/sales/DeliveryChallans";
import PaymentsReceived from "./pages/sales/PaymentsReceived";
import CreditNotes from "./pages/sales/CreditNotes";
import CreateCustomer from "./pages/sales/CreateCustomer";
import EditCustomer from "./pages/sales/EditCustomer";
import CreateQuote from "./pages/sales/CreateQuote";
import EditQuote from "./pages/sales/EditQuote";
import CreateOrder from "./pages/sales/CreateOrder";
import EditOrder from "./pages/sales/EditOrder";
import CreateInvoice from "./pages/sales/CreateInvoice";
import EditInvoice from "./pages/sales/EditInvoice";
import CreateRecurringInvoice from "./pages/sales/CreateRecurringInvoice";
import CreateDeliveryChallan from "./pages/sales/CreateDeliveryChallan.tsx";
import RecordPayment from "./pages/sales/RecordPayment";
import EditPayment from "./pages/sales/EditPayment";
import CreateCreditNote from "./pages/sales/CreateCreditNote";
// import Sales from "./pages/Sales"; // Old sales
import CreateSales from "./pages/CreateSales";
import EditSales from "./pages/EditSales";
import Purchases from "./pages/Purchases";
import CreatePurchase from "./pages/CreatePurchase";
import EditPurchase from "./pages/EditPurchase";
import Vendors from "./pages/Vendors.tsx";
import Contacts from "./pages/Contacts";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Units from "./pages/Units";
import CreateUnits from "./pages/CreateUnits";
import EditUnits from "./pages/EditUnits";
import CreateAccountType from "./pages/CreateAccounttype";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AccountType from "./pages/AccountType.tsx";
import Item from "./pages/Item.tsx";
import CreateItem from "./pages/CreateItem.tsx";
import EditItem from "./pages/EditItem.tsx";
import PaymentTerms from "./pages/PaymentTerms";
import ChartOfAccount from "./pages/ChartOfAccount";
import CreatePaymentTerms from "./pages/CreatePaymentTerms";
import CreateChartOfAccount from "./pages/CreateChartOfAccount";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              // <ProtectedRoute>
              <Index />
              // </ProtectedRoute>
            } />
            <Route path="/item" element={
              //  <ProtectedRoute>
              <Item />
              // </ProtectedRoute>
            } />
            <Route path="/item/create" element={
              //  <ProtectedRoute>
              <CreateItem />
              // </ProtectedRoute>
            } />
            <Route path="/item/edit/:id" element={
              //  <ProtectedRoute>
              <EditItem />
              // </ProtectedRoute>
            } />
            {/* Sales Module Routes */}
            <Route path="/sales/customers" element={<Customers />} />
            <Route path="/sales/customers/create" element={<CreateCustomer />} />
            <Route path="/sales/customers/edit/:id" element={<EditCustomer />} />

            <Route path="/sales/quotes" element={<Quotes />} />
            <Route path="/sales/quotes/create" element={<CreateQuote />} />
            <Route path="/sales/quotes/edit/:id" element={<EditQuote />} />

            <Route path="/sales/orders" element={<SalesOrders />} />
            <Route path="/sales/orders/create" element={<CreateOrder />} />
            <Route path="/sales/orders/edit/:id" element={<EditOrder />} />

            <Route path="/sales/invoices" element={<Invoices />} />
            <Route path="/sales/invoices/create" element={<CreateInvoice />} />
            <Route path="/sales/invoices/edit/:id" element={<EditInvoice />} />

            <Route path="/sales/recurring-invoices" element={<RecurringInvoices />} />
            <Route path="/sales/recurring-invoices/create" element={<CreateRecurringInvoice />} />

            <Route path="/sales/delivery-challans" element={<DeliveryChallans />} />
            <Route path="/sales/delivery-challans/create" element={<CreateDeliveryChallan />} />

            <Route path="/sales/payments-received" element={<PaymentsReceived />} />
            <Route path="/sales/payments-received/create" element={<RecordPayment />} />
            <Route path="/sales/payments-received/edit/:id" element={<EditPayment />} />

            <Route path="/sales/credit-notes" element={<CreditNotes />} />
            <Route path="/sales/credit-notes/create" element={<CreateCreditNote />} />

            {/* Existing Sales Create/Edit (kept for backward compatibility or shared forms) */}
            <Route path="/sales" element={<SalesOrders />} />
            <Route path="/sales/create" element={<CreateSales />} />
            <Route path="/sales/edit/:id" element={<EditSales />} />

            <Route path="/invoices" element={<Invoices />} />

            <Route path="/purchases" element={
              // <ProtectedRoute>
              <Purchases />
              // </ProtectedRoute>
            } />
            <Route path="/purchases/create" element={
              //  <ProtectedRoute>
              <CreatePurchase />
              // </ProtectedRoute>
            } />
            <Route path="/purchases/edit/:id" element={
              //  <ProtectedRoute>
              <EditPurchase />
              // </ProtectedRoute>
            } />
            <Route path="/contacts" element={
              //  <ProtectedRoute>
              <Contacts />
              // </ProtectedRoute>
            } />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/expenses" element={
              //  <ProtectedRoute>
              <Expenses />
              // </ProtectedRoute>
            } />
            <Route path="/reports" element={
              //  <ProtectedRoute>
              <Reports />
              // </ProtectedRoute>
            } />
            <Route path="/settings" element={
              //  <ProtectedRoute>
              <Settings />
              // </ProtectedRoute>
            } />
            <Route path="/" element={
              //  <ProtectedRoute>
              <Units />
              // </ProtectedRoute>
            } />
            <Route path="/units" element={
              //  <ProtectedRoute>
              <Units />
              // </ProtectedRoute>
            } />
            <Route path="/units/create" element={
              // <ProtectedRoute>
              <CreateUnits />
              // </ProtectedRoute>
            } />
            <Route path="/units/edit/:id" element={
              //  <ProtectedRoute>
              <EditUnits />
              // </ProtectedRoute>
            } />
            <Route path="/account-types" element={
              //  <ProtectedRoute>
              <AccountType />
              // </ProtectedRoute>
            } />
            <Route path="/account-type/create" element={
              //  <ProtectedRoute>
              <CreateAccountType />
              // </ProtectedRoute>
            } />
            <Route path="/payment-terms" element={
              //  <ProtectedRoute>
              <PaymentTerms />
              // </ProtectedRoute>
            } />
            <Route path="/chart-of-accounts" element={
              //  <ProtectedRoute>
              <ChartOfAccount />
              // </ProtectedRoute>
            } />
            <Route path="/payment-terms/create" element={
              //  <ProtectedRoute>
              <CreatePaymentTerms />
              // </ProtectedRoute>
            } />
            <Route path="/chart-of-accounts/create" element={
              //  <ProtectedRoute>
              <CreateChartOfAccount />
              // </ProtectedRoute>
            } />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
