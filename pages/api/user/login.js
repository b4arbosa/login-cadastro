import { login } from "@/services/user";

//funcionamento do login
    export default function handler(req, res) {
       try {
        const user = login(req.body)
        res.status(200).json(user)
       } catch (err) {
        res.status(400).json("usuario não encontrado")
       } 
    }