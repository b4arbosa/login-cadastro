import { getCookie } from "cookies-next"
import { useEffect } from "react"
import { login } from "@/services/user"


export default function Home() {
  return (
    <div>
      Página segura - Perfil do usuário
    </div>
  )
}


export const getServerSideProps = async (context) => {
  // Obter o token do cookie (passando req e res do contexto)
  const token = await getCookie("authorization", {
    req: context.req,
    res: context.res,
  });

  // Verifica se o token existe
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login", // Redireciona para a página de login
      },
    };
  }

  // Caso o token exista, retorna props normais
  return {
    props: {}, // Dados a serem passados para a página
  };
};
