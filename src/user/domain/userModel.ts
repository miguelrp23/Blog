
class NewUser {
     name: string; 
    lastName: string;
    email: string;
    user: string;
    password: string;
    role: string; 

    constructor(name: string, lastName:string, email: string, user:string, password: string, role: string) {
    this.name = name;
    this.lastName = lastName;
    this.email= email;
    this.user = user;
    this.password = password;
    this.role = role;

    }
   
}


export {NewUser}





