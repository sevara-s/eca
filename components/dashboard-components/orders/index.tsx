"use client"

import { request } from "@/request"
import { useQuery } from "@tanstack/react-query"
// interface  Orders {
//   id: number;
//   productName: string;
//   productSeriaNumber: string,
//   employeeId: 0,
//   status?: string;
//   role?: string;
// }
// interface OrderResponse {
//   content: Orders[];
// }

export default function OrderList (){
    const {data} = useQuery({
        queryKey:["orders"],
        queryFn:async()=>{
            const res = await request.get("/booking-product/get-all")
            return res.data.content ?? []
        }
    })

    return (
     <ul>{data?.map((order: any) => <li key={order.id}>{order.productName}</li>)}</ul>
    )
}
