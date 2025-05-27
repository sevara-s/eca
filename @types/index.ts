export interface SidebarItems {
    id:number | string
    icon:string,
    title:string,
    path:string,

}

export type AccountType = 'MASTER' | 'OWNER' | string
export interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  accountType: AccountType;  
  employeeId?: string;
}