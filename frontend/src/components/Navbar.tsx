import { useAuth } from "../context/Authcontext";
function Navbar() {
    const {user} = useAuth();
    return(
        <header>
            <h1>Ai Property Management Agent</h1>
            <div>
                <span>
                    {user?.name}
                </span>
            </div>
        </header>
    )
}
export default Navbar