import Link from 'next/link'
import styles from '../styles/login.module.css'

import LoginCard from "@/styles/src/components/loginCard/loginCard"
import Input from '@/styles/src/components/loginCard/input/input'
import Button from '@/styles/src/components/button/button'

export default function LoginPage() {
    return (
        <div className={styles.background}>
            <LoginCard title="Entre em sua conta">
                <form className={styles.form}>
                <Input type="email" placeholder="Seu e-mail" />
                <Input type="password" placeholder="Sua senha" />
                <Button>Login</Button>
                <Link href="/cadastro">Ainda não possui conta?</Link>
                </form>               
            </LoginCard>
        </div>
    )
}