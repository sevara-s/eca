import {request} from "../../../request/index"
import { QueryClient,dehydrate,HydrationBoundary } from "@tanstack/react-query"
import UserOrderList from "@/components/dashboard-components/user-order"
const getUserOrder = async ()=>{
    const res = await request.get("/booking-product/get-all-by-employee")
    return res.data.content
}


export const UserOrders = async ()=>{
    const queryClient = new QueryClient ();
    await queryClient.prefetchQuery({
        queryKey:["user-orders"],
        queryFn:getUserOrder,
    })

      const dehydratedState = dehydrate(queryClient);

      return(
        <div>
            <HydrationBoundary state={dehydratedState}>
            <UserOrderList/>

            </HydrationBoundary>
        </div>
      )
}

export default UserOrders