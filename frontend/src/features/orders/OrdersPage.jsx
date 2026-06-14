import { useState } from "react";
import toast from "react-hot-toast";

import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PageHeader from "../../components/ui/PageHeader";
import { Table, Td } from "../../components/ui/Table";
import { EmptyState, ErrorState, Spinner } from "../../components/ui/States";
import { useDeleteOrder, useOrders } from "../../hooks/useOrders";
import { extractErrorMessage } from "../../lib/apiClient";
import { formatCurrency, formatDate } from "../../lib/format";
import OrderDetail from "./OrderDetail";
import OrderForm from "./OrderForm";

const STATUS_TONE = {
  completed: "green",
  pending: "amber",
  cancelled: "red",
};

export default function OrdersPage() {
  const { data: orders, isLoading, isError, error } = useOrders();
  const deleteOrder = useDeleteOrder();

  const [formOpen, setFormOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  async function confirmDelete() {
    try {
      await deleteOrder.mutateAsync(pendingDelete.id);
      toast.success("Order cancelled");
      setPendingDelete(null);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Create and track customer orders"
        action={<Button onClick={() => setFormOpen(true)}>Create order</Button>}
      />

      {isLoading && <Spinner />}
      {isError && <ErrorState message={extractErrorMessage(error)} />}

      {orders && orders.length === 0 && (
        <EmptyState
          message="No orders yet."
          action={<Button onClick={() => setFormOpen(true)}>Create your first order</Button>}
        />
      )}

      {orders && orders.length > 0 && (
        <Table headers={["Order", "Customer", "Items", "Total", "Status", "Placed", "Actions"]}>
          {orders.map((order) => (
            <tr key={order.id}>
              <Td className="font-medium text-slate-800">#{order.id}</Td>
              <Td>{order.customer_id}</Td>
              <Td>{order.items.length}</Td>
              <Td>{formatCurrency(order.total_amount, order.currency)}</Td>
              <Td>
                <Badge tone={STATUS_TONE[order.status] || "slate"}>{order.status}</Badge>
              </Td>
              <Td>{formatDate(order.created_at)}</Td>
              <Td>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setDetailId(order.id)}>
                    View
                  </Button>
                  <Button variant="ghost" onClick={() => setPendingDelete(order)}>
                    Cancel
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      )}

      <OrderForm open={formOpen} onClose={() => setFormOpen(false)} />
      <OrderDetail orderId={detailId} onClose={() => setDetailId(null)} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Cancel order"
        message={`Cancel order #${pendingDelete?.id}? Stock will be restored.`}
        confirmLabel="Cancel order"
        loading={deleteOrder.isPending}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
