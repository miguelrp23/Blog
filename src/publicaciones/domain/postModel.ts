import { NewUser } from "../../user/domain/userModel";

class Publicacion {
    tittle: string; 
    content: string;
    createdAt: Date;
    likes: number;
    dislikes: number;
    authorId: string; 
    author: NewUser
   constructor( tittle: string, content: string, createdAt: Date, likes: number, dislikes: number, authorId: string, author: NewUser) {
   this.tittle = tittle;
   this.content = content;
   this.createdAt= createdAt;
   this.likes = likes;
   this.dislikes = dislikes;
   this.authorId = authorId
   this.author = author;

   }
  
}

export { Publicacion}