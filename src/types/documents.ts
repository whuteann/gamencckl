
export interface UserType {
  id?: string;
  name: string;
  searchname?: string;
  password?: string;
  role: "User" | "Admin";
  credits: number,

  created_at?: Date;
}

export interface GameType {
  id?: string;
  winner_determined: boolean;
  created_at: Date;
  winner?: string;
}