import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import { TextField } from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import { useCreateCustomer } from "../../hooks/useCustomers";
import { extractErrorMessage } from "../../lib/apiClient";

const EMPTY = { full_name: "", email: "", phone: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CustomerForm({ open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const createCustomer = useCreateCustomer();

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setErrors({});
    }
  }, [open]);

  function validate() {
    const next = {};
    if (!form.full_name.trim()) next.full_name = "Name is required";
    if (!EMAIL_PATTERN.test(form.email)) next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Phone is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    try {
      await createCustomer.mutateAsync({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      toast.success("Customer created");
      onClose();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <Modal open={open} title="Add customer" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          label="Full name"
          value={form.full_name}
          error={errors.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          label="Phone"
          value={form.phone}
          error={errors.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={createCustomer.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={createCustomer.isPending}>
            {createCustomer.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
