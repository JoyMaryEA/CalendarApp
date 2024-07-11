export interface IUser {
   
color:string,
email?:string,
end_date:string,
first_name:string,
last_name?:string,
password?:string,
period_id?:string,
start_date:string,
u_id:string,
userDates?: number[]
  }

export interface IuserLogin{
    success:string,
    token:string,
    u_id:string,
    first_name:string,
    last_name:string
}
export interface error{
    error:string
}
export interface officeDays{
  start_date:string,
  end_date:string,
  color?:string
}
