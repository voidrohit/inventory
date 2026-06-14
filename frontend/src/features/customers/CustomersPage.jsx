import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PageHeader from "../../components/ui/PageHeader";
import { Table, Td } from "../../components/ui/Table";
import { EmptyState, ErrorState, Spinner } from "../../components/ui/States";
import { useCustomers, useDeleteCustomer } from "../../hooks/useCustomers";
import { extractErrorMessage } from "../../lib/apiClient";
import CustomerForm from "./CustomerForm";

export default function CustomersPage() {
  const { data: customers, isLoading, isError, error } = useCustomers();
  const deleteCustomer = useDeleteCustomer();

  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  async function confirmDelete() {
    try {
      await deleteCustomer.mutateAsync(pendingDelete.id);
      toast.success("Customer deleted");
      setPendingDelete(null);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="People who place orders"
        action={<Button onClick={() => setFormOpen(true)}>Add customer</Button>}
      />

      {isLoading && <Spinner />}
      {isError && <ErrorState message={extractErrorMessage(error)} />}

      {customers && customers.length === 0 && (
        <EmptyState
          message="No customers yet."
          action={<Button onClick={() => setFormOpen(true)}>Add your first customer</Button>}
        />
      )}

      {customers && customers.length > 0 && (
        <Table headers={["Name", "Email", "Phone", "Actions"]}>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <Td className="font-medium text-slate-800">{customer.full_name}</Td>
              <Td>{customer.email}</Td>
              <Td>{customer.phone}</Td>
              <Td>
                <Button variant="ghost" onClick={() => setPendingDelete(customer)}>
                  Delete
                </Button>
              </Td>
            </tr>
          ))}
        </Table>
      )}

      <CustomerForm open={formOpen} onClose={() => setFormOpen(false)} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete customer"
        message={`Delete "${pendingDelete?.full_name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteCustomer.isPending}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
