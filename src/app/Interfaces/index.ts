export interface IUser {
count?: number
   
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
    role:string,
    team_id:string,
    success:string,
    token:string,
    u_id:string,
    first_name:string,
    last_name:string
}
export interface error{
    error:string
}
export interface SuccessMessages{
  success:string,
  newDays?:any
}
export interface officeDays{
  id?: string | undefined
  start_date:string,
  end_date:string,
  color?:string,
  first_name?:string
  last_name?:string
  u_id?:string
  
}
export interface calendarEvent{
  start:string,
  end:string,
  title:string,
  
}

export enum View {
  Summary = 'summary',
  StaffOfficeDays = 'staffOfficeDays',
  MyOfficeDates = 'myOfficeDates'
}

export interface Imanager{
  role: number,
  team_id:number
}

export interface selectedUserInputField{
  username:string, u_id:string
}

export interface confirmModalData{
  numberOfDatesSelected:number, 
  dateSelected:string
}

export interface team {team_id:number,team_name:string}