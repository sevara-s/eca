"use client"
import { useQuery } from "@tanstack/react-query"
import { request } from "@/request"
// import { useState,useEffect } from "react"
// import { NotificationApi } from "@/generics/notification"
 

 
export default function EmployeeList (){

  const {data=[]} = useQuery({
    queryKey:["xodimlar"],
    queryFn:async ()=>{
      const res = await request.get("/employee/get-all")
      return res.data.data
    }
  })

  return(
    <>
    <ul>
    {data.map((em:any)=>{
      <li key={em.id}>{em.firsName}</li>

    })}
    </ul>
    </>
  )


}
