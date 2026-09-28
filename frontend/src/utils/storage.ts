const TOKEN_KEY="property_management_token";
export const storage ={
    getToken():string | null {
        return localStorage.getItem(TOKEN_KEY)
    },
    setToken(token:string){
        localStorage.setItem(TOKEN_KEY,token)
    },
    removeToken():void{
        localStorage.removeItem(TOKEN_KEY);
    },
};