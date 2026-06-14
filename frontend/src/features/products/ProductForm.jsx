import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import { SelectField, TextField } from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import { useCreateProduct, useUpdateProduct } from "../../hooks/useProducts";
import { extractErrorMessage } from "../../lib/apiClient";
import { CURRENCIES } from "../../lib/format";

const EMPTY = { name: "", sku: "", price: "", currency: "USD", quantity_in_stock: "" };

export default function ProductForm({ open, product, onClose }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const submitting = createProduct.isPending || updateProduct.isPending;

  useEffect(() => {
    if (!open) return;
    setForm(
      product
        ? {
            name: product.name,
            sku: product.sku,
            price: String(product.price),
            currency: product.currency,
            quantity_in_stock: String(product.quantity_in_stock),
          }
        : EMPTY
    );
    setErrors({});
  }, [open, product]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.sku.trim()) next.sku = "SKU is required";
    if (form.price === "" || Number(form.price) < 0) next.price = "Enter a valid price";
    if (form.quantity_in_stock === "" || Number(form.quantity_in_stock) < 0) {
      next.quantity_in_stock = "Enter a valid quantity";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      currency: form.currency,
      quantity_in_stock: Number(form.quantity_in_stock),
    };

    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id: product.id, payload });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(payload);
        toast.success("Product created");
      }
      onClose();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <Modal open={open} title={isEdit ? "Edit product" : "Add product"} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="SKU"
          value={form.sku}
          error={errors.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            error={errors.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <SelectField
            label="Currency"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            {CURRENCIES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </div>
        <TextField
          label="Quantity"
          type="number"
          min="0"
          value={form.quantity_in_stock}
          error={errors.quantity_in_stock}
          onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
