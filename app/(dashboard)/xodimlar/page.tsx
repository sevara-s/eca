import { request } from "../../../request/index";

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import EmployeeList from "../../../components/dashboard-components/xodimlar";

const getEmployee = async () => {
  const res = await request.get("/employee/get-all");

  return res.data.data;
};

const Employee = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["xodimlar"],
    queryFn: getEmployee,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="">
      <HydrationBoundary state={dehydratedState}>
        <EmployeeList/>
      </HydrationBoundary>
    </div>
  );
};

export default Employee;
