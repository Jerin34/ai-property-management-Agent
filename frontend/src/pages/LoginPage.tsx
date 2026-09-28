import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext.tsx'
function LoginPage(){
const navigate = useNavigate();
    const {login,isLoading} = useAuth();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const handleSubmit = async(event:React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        try{
            await login(email,password);
            navigate('/dashboard')
        }catch(error){
            console.log(error)
            //TODO: handle error
        }
    };
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" name="Email" id="email" placeholder='Enter your email' value={email}  onChange={(event) => setEmail(event.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder='Enter your Password' value={password}  onChange={(event) => setPassword(event.target.value)} />
                <button type="submit">{  isLoading ? "Logging in..." : "Login"}</button>
            </form>
        </div>
    )
}
export default LoginPage