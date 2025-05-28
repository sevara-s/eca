import { request } from "../../../request/index";
import OrderList from "@/components/dashboard-components/orders";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

const getOrders = async () => {
  const res = await request.get("/booking-product/get-all");
  return res.data.data;
};

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <HydrationBoundary state={dehydratedState}>
        <OrderList />
      </HydrationBoundary>
    </div>
  );
}
