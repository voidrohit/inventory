import Modal from "../../components/ui/Modal";
import { Table, Td } from "../../components/ui/Table";
import { Spinner, ErrorState } from "../../components/ui/States";
import { useOrder } from "../../hooks/useOrders";
import { extractErrorMessage } from "../../lib/apiClient";
import { formatCurrency, formatDate } from "../../lib/format";

export default function OrderDetail({ orderId, onClose }) {
  const { data: order, isLoading, isError, error } = useOrder(orderId);

  return (
    <Modal open={Boolean(orderId)} title={`Order #${orderId ?? ""}`} onClose={onClose}>
      {isLoading && <Spinner />}
      {isError && <ErrorState message={extractErrorMessage(error)} />}

      {order && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500">Customer</p>
              <p className="font-medium text-slate-800">{order.customer?.full_name}</p>
              <p className="text-xs text-slate-400">{order.customer?.email}</p>
            </div>
            <div>
              <p className="text-slate-500">Status</p>
              <p className="font-medium capitalize text-slate-800">{order.status}</p>
            </div>
            <div>
              <p className="text-slate-500">Placed</p>
              <p className="font-medium text-slate-800">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-slate-500">Currency</p>
              <p className="font-medium text-slate-800">{order.currency}</p>
            </div>
          </div>

          <Table headers={["Product ID", "Quantity", "Unit price", "Subtotal"]}>
            {order.items.map((item) => (
              <tr key={item.id}>
                <Td>{item.product_id}</Td>
                <Td>{item.quantity}</Td>
                <Td>{formatCurrency(item.unit_price, order.currency)}</Td>
                <Td>{formatCurrency(Number(item.unit_price) * item.quantity, order.currency)}</Td>
              </tr>
            ))}
          </Table>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm text-slate-500">Total</span>
            <span className="text-lg font-semibold text-slate-800">
              {formatCurrency(order.total_amount, order.currency)}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
