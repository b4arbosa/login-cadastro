import { useState } from 'react'
import Link from 'next/link'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/router'

import styles from '../styles/cadastro.module.css'

import LoginCard from "@/styles/src/components/loginCard/loginCard"
import Input from '@/styles/src/components/loginCard/input/input'
import Button from '@/styles/src/components/button/button'

export default function CadastroPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const [error, setError] = useState('')
    const router = useRouter()

    const handleFormEdit = (event, name) => {
        setFormData({
            ...formData,
            [name]: event.target.value
        })
    }
     
    const handleForm = async (event) => {
        try {
            event.preventDefault()
            const response = await fetch(`/api/user/cadastro`, {
                method: 'POST' ,
                body: JSON.stringify(formData)
            })
            const json = await response.json()
            if (response.status !==201) throw new Error(json)

          setCookie('authorization', json)
          router.push('/')   
        } catch (err) {
            setError(err.message)
        }
    }

    return (


        <div className={styles.background}>

            <header className='text-white'>
                teste
            </header>
            <main>

                <section>
                <LoginCard title="Cadastro">
                <form className={styles.form} onSubmit={handleForm}>
                <label htmlFor="nome">Nome e Sobrenome</label>
                <Input id="nome" type="text" placeholder="Seu nome" required value={formData.name} onChange={(e) => {handleFormEdit(e, 'name')}} />

                <div class="div-label">
                    <div>
                <label htmlFor="telefone">Telefone/Celular</label>
                <Input id="telefone" type="string" placeholder="(11)1111-1111" required value={formData.number} onChange={(e) => {handleFormEdit(e, 'number')}} />
                    </div>
                    <div>
                <label htmlFor="nascimento">Data de Nascimento</label>
                <Input id='nascimento' type="date" required value={formData.date} onChange={(e) => {handleFormEdit(e, 'date')}} />
                    </div>
                </div>


                <label htmlFor="email">Endereço de Email</label>
                <Input id="email" type="email" placeholder="Seu e-mail" required value={formData.email} onChange={(e) => {handleFormEdit(e, 'email')}} />
                <label htmlFor="senha">Senha</label>
                <Input id='senha' type="password" placeholder="Sua senha" required value={formData.password} onChange={(e) => {handleFormEdit(e, 'password')}} />
                <Button type="submit">Cadastrar</Button>
                {error && <p className={styles.error}>{error}</p>}
                <Link href="/login">Já possui uma conta?</Link>
                </form>
                </LoginCard>
                </section>
                <section>
                    <h1>teste</h1>
                </section>
            
            </main>
        </div>
    )
}