import { useState } from "react";
import toast from "react-hot-toast";

import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PageHeader from "../../components/ui/PageHeader";
import { Table, Td } from "../../components/ui/Table";
import { EmptyState, ErrorState, Spinner } from "../../components/ui/States";
import { useDeleteProduct, useProducts } from "../../hooks/useProducts";
import { extractErrorMessage } from "../../lib/apiClient";
import { formatCurrency } from "../../lib/format";
import ProductForm from "./ProductForm";

const LOW_STOCK_LIMIT = 10;

export default function ProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [formState, setFormState] = useState({ open: false, product: null });
  const [pendingDelete, setPendingDelete] = useState(null);

  function openCreate() {
    setFormState({ open: true, product: null });
  }

  function openEdit(product) {
    setFormState({ open: true, product });
  }

  async function confirmDelete() {
    try {
      await deleteProduct.mutateAsync(pendingDelete.id);
      toast.success("Product deleted");
      setPendingDelete(null);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your catalog and stock levels"
        action={<Button onClick={openCreate}>Add product</Button>}
      />

      {isLoading && <Spinner />}
      {isError && <ErrorState message={extractErrorMessage(error)} />}

      {products && products.length === 0 && (
        <EmptyState
          message="No products yet."
          action={<Button onClick={openCreate}>Add your first product</Button>}
        />
      )}

      {products && products.length > 0 && (
        <Table headers={["Name", "SKU", "Price", "Currency", "Stock", "Actions"]}>
          {products.map((product) => (
            <tr key={product.id}>
              <Td className="font-medium text-slate-800">{product.name}</Td>
              <Td>{product.sku}</Td>
              <Td>{formatCurrency(product.price, product.currency)}</Td>
              <Td>{product.currency}</Td>
              <Td>
                {product.quantity_in_stock <= LOW_STOCK_LIMIT ? (
                  <Badge tone="amber">{product.quantity_in_stock}</Badge>
                ) : (
                  <Badge tone="green">{product.quantity_in_stock}</Badge>
                )}
              </Td>
              <Td>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(product)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => setPendingDelete(product)}>
                    Delete
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      )}

      <ProductForm
        open={formState.open}
        product={formState.product}
        onClose={() => setFormState({ open: false, product: null })}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete product"
        message={`Delete "${pendingDelete?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteProduct.isPending}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
