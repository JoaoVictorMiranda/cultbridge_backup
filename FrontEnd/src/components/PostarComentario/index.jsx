import { FaHeart } from "react-icons/fa";

import React, { useEffect, useState } from 'react'
import api from '../../api.js'
import './index.scss'

const PostarComentario = ({ idFilme }) => {
        const [titulo, setTitulo] = useState('');
        const [avaliacao, setAvaliacao] = useState('');
        const [nota, setNota] = useState('');
        const [posts, setPosts] = useState([]);
        const [curtido, setCurtido] = useState(false);
        const [token, setToken] = useState();
        const id_filme = idFilme;
        useEffect(() => {
                setToken(localStorage.getItem("token"))
                CurtirComentario();
                carregarComentarios();
                Verificar()
        }, []);

        async function EnviarComentario() {
                if (!titulo || !avaliacao || !nota) {
                        alert('Erro ao enviar seu post!');
                        return;
                }

                const comentario = {
                        "titulo": titulo,
                        "id_filme": id_filme,
                        "avaliacao": avaliacao,
                        "nota": nota
                }

                try {
                        await api.post('/EnviarComentario', comentario)
                        carregarComentarios();
                }

                catch (err) {
                        alert('Erro ao enviar avaliação!');
                        return;
                }
        }


        async function carregarComentarios() {
                try {
                        const resp = await api.get(`/post/${id_filme}`)
                        setPosts(resp.data)

                } catch

                (err) {
                        console.log(err)
                }
        }

        async function Verificar() {
                const resp = await api.post('/VerSeCurtiu')

                const token = localStorage.getItem("token");

                if (resp.data.id_user == token) {
                        setCurtido('Red')
                }

                else {
                        setCurtido('Black')
                }
        }

        async function CurtirComentario(pos) {
                const id_post = posts[pos].id_post;

                const post = { "id_post": id_post }

                try {
                        await api.post(`/post/curtir`, post)

                        await carregarComentarios();
                }

                catch (err) {
                        alert('Não pode curtir uma avaliação já curtida!');
                        console.log(err);
                        return;
                }

        }



        return (
                <div className='AlinhadorGeralComentario'>
                        <label htmlFor="titulo">Titulo</label>
                        <input type="text" placeholder='Titulo' name='titulo' value={titulo} onChange={e => setTitulo(e.target.value)} />
                        <label htmlFor="avaliacao">Avaliacao</label>
                        <textarea name="avaliacao" id="avaliacao" value={avaliacao} onChange={e => setAvaliacao(e.target.value)}></textarea>
                        <label htmlFor="nota">Nota</label>
                        <input type="number" name="nota" id="nota" value={nota} onChange={(e) => setNota(e.target.value)} />
                        <button onClick={EnviarComentario}>ENVIAR</button>
                        <div className="container_posts">

                                {posts.map((post, pos) => (
                                        <div key={pos} className="Card_post">
                                                <h2>{post.nome}</h2> 
                                                <h3>{post.titulo}</h3>
                                                <p>{post.avaliacao}</p>
                                                <p>Filme: {post.id_filme}</p>
                                                <p>Nota: {post.nota}</p>
                                                <p>Data: {post.criado_em.split("T")[0]}</p>
                                                <div className="Like">
                                                        <FaHeart style={{ color: Verificar }} onClick={() => CurtirComentario(pos)}></FaHeart>
                                                        <p>{post.curtidas}</p>
                                                </div>
                                        </div>
                                ))}
                        </div>
                </div>
        )
}

export default PostarComentario;