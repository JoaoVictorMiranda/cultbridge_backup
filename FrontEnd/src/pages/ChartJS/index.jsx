import './index.scss'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DefinirTopico from '../../components/Topicos'
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useState, useEffect } from 'react';
import api from '../../api'

export default function index() {
    const [count, setCount] = useState([])
    const [adminCount, setAdmin] = useState([])

    async function ExibirUsuarios() {
        const resp = await api('/contar/usuarios')
        setCount(resp.data[0].usuarios)
    }

    async function ExibirComunidades() {
        const resp = await api('/contar/comunidades')
        setAdmin(resp.data[0].usuarios)
    }

    useEffect(() => {
        ExibirUsuarios()
        ExibirComunidades()
    }, [])

    return (
        <div className='Gráfico'>
            <Header />
            <div className='InfoSite'>
                <DefinirTopico
                    tema={'ADMINISTRAÇÃO'} />

                <div className="AlignCounter">
                    <div className="Left">
                        <FaUser id='Users' />
                        <div className="Title">
                            <h3>{count ? count : 'None users found'}</h3>
                            <h2>Total Users</h2>
                        </div>
                    </div>
                    <div className="Right">
                        <MdAdminPanelSettings id='Admin' />
                        <div className="Title">
                            <h3>{adminCount ? adminCount : 'None admin found'}</h3>
                            <h2>Admin</h2>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
