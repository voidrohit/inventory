import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import { SelectField } from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import { useCreateOrder } from "../../hooks/useOrders";
import { useCustomers } from "../../hooks/useCustomers";
import { useProducts } from "../../hooks/useProducts";
import { extractErrorMessage } from "../../lib/apiClient";
import { formatCurrency } from "../../lib/format";

const emptyLine = () => ({ product_id: "", quantity: 1 });

export default function OrderForm({ open, onClose }) {
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const createOrder = useCreateOrder();

  const [customerId, setCustomerId] = useState("");
  const [lines, setLines] = useState([emptyLine()]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCustomerId("");
      setLines([emptyLine()]);
      setError("");
    }
  }, [open]);

  const productMap = useMemo(() => {
    const map = new Map();
    (products || []).forEach((product) => map.set(String(product.id), product));
    return map;
  }, [products]);

  const selectedCurrencies = useMemo(() => {
    const set = new Set();
    lines.forEach((line) => {
      const product = productMap.get(String(line.product_id));
      if (product) set.add(product.currency);
    });
    return [...set];
  }, [lines, productMap]);

  const orderCurrency = selectedCurrencies.length === 1 ? selectedCurrencies[0] : null;
  const mixedCurrencies = selectedCurrencies.length > 1;

  const total = useMemo(() => {
    return lines.reduce((sum, line) => {
      const product = productMap.get(String(line.product_id));
      if (!product) return sum;
      return sum + Number(product.price) * Number(line.quantity || 0);
    }, 0);
  }, [lines, productMap]);

  function updateLine(index, changes) {
    setLines((current) =>
      current.map((line, i) => (i === index ? { ...line, ...changes } : line))
    );
  }

  function addLine() {
    setLines((current) => [...current, emptyLine()]);
  }

  function removeLine(index) {
    setLines((current) => current.filter((_, i) => i !== index));
  }

  function validate() {
    if (!customerId) return "Select a customer";
    if (lines.length === 0) return "Add at least one product";

    const seen = new Set();
    for (const line of lines) {
      if (!line.product_id) return "Select a product for every line";
      if (Number(line.quantity) <= 0) return "Quantity must be at least 1";
      if (seen.has(line.product_id)) return "Each product may appear only once";
      seen.add(line.product_id);

      const product = productMap.get(String(line.product_id));
      if (product && Number(line.quantity) > product.quantity_in_stock) {
        return `Only ${product.quantity_in_stock} of "${product.name}" in stock`;
      }
    }
    if (mixedCurrencies) return "All products in an order must use the same currency";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    try {
      await createOrder.mutateAsync({
        customer_id: Number(customerId),
        items: lines.map((line) => ({
          product_id: Number(line.product_id),
          quantity: Number(line.quantity),
        })),
      });
      toast.success("Order created");
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  return (
    <Modal open={open} title="Create order" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <SelectField
          label="Customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Select a customer</option>
          {(customers || []).map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.full_name}
            </option>
          ))}
        </SelectField>

        <div className="space-y-3">
          <span className="block text-sm font-medium text-slate-700">Items</span>
          {lines.map((line, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <SelectField
                  label=""
                  value={line.product_id}
                  onChange={(e) => updateLine(index, { product_id: e.target.value })}
                >
                  <option value="">Select a product</option>
                  {(products || []).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} — {formatCurrency(product.price, product.currency)} (
                      {product.quantity_in_stock} in stock)
                    </option>
                  ))}
                </SelectField>
              </div>
              <input
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) => updateLine(index, { quantity: e.target.value })}
                className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button
                variant="ghost"
                onClick={() => removeLine(index)}
                disabled={lines.length === 1}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addLine}>
            Add item
          </Button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">
            Estimated total {orderCurrency ? `(${orderCurrency})` : ""}
          </span>
          <span className="text-lg font-semibold text-slate-800">
            {mixedCurrencies ? "—" : formatCurrency(total, orderCurrency || "USD")}
          </span>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={createOrder.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={createOrder.isPending}>
            {createOrder.isPending ? "Placing..." : "Place order"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
