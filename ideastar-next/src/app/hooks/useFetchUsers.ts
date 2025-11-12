import { useEffect, useState } from "react";
import { fetchUsers } from "../utils/fetchUsers";

interface UserType {
    id: string;
    name: string;
    first_name: string;
    last_name?: string;
    profile_image: string;
    followers_count: number;
    following_count: number;
    role:string;
    created_at: string;
    updated_at: string;
    email?: string;
}
const useFetchUsers = () =>{
    const [users, setUsers] = useState<Array<UserType>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null)
    useEffect(() =>{
        (async() =>{
            try{
                const users = await fetchUsers();
                setUsers(users?.users);
            }catch(error){
                setError((error as Error).message);
            }finally{
                setLoading(false);
            }
        })()
    },[]);
    return {users, loading, error}
};
export default useFetchUsers;   









