import { headers } from "next/headers";
import {redirect} from "next/navigation"
import { auth } from "./auth";

export async function requireAuth() {
    const session = await auth.api.getSession({
        headers : await headers(),
    })

    if(!session){
        redirect("/login")
    }

    return session;
}

export async function requireUnAuth() {
    const session = await auth.api.getSession({
        headers : await headers(),
    })

    if(session){
        redirect("/")
    }
}