import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";
import { Table, Td } from "../../components/ui/Table";
import { EmptyState, ErrorState, Spinner } from "../../components/ui/States";
import { useDashboard } from "../../hooks/useDashboard";
import { extractErrorMessage } from "../../lib/apiClient";

const STATS = [
  { key: "total_products", label: "Products" },
  { key: "total_customers", label: "Customers" },
  { key: "total_orders", label: "Orders" },
];

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} />;

  const lowStock = data.low_stock_products;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your inventory and orders" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.key}>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-800">{data[stat.key]}</p>
          </Card>
        ))}
        <Card>
          <p className="text-sm text-slate-500">Low stock</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">{lowStock.length}</p>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Low stock products</h2>
        {lowStock.length === 0 ? (
          <Card>
            <EmptyState message="All products are sufficiently stocked." />
          </Card>
        ) : (
          <Table headers={["Name", "SKU", "Quantity"]}>
            {lowStock.map((product) => (
              <tr key={product.id}>
                <Td>{product.name}</Td>
                <Td>{product.sku}</Td>
                <Td>
                  <Badge tone="amber">{product.quantity_in_stock} left</Badge>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}
