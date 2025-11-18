import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router';
import api from '../../api';
import './index.scss';

export default function ConfigurarPerfil() {
  const [foto, setFoto] = useState(null);
  const [arquivo, setArquivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivo(file);
      setFoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!arquivo) return;

    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Usuário não autenticado!');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id_user || decoded.id;

      const formData = new FormData();
      formData.append('img', arquivo);

      const resposta = await api.post('/usuario/perfil', formData, {
        headers: {
          'x-access-token': token,
          'Content-Type': 'multipart/form-data'
        },
      });

      const { caminho } = resposta.data;

      localStorage.setItem(`fotoPerfil_${userId}`, caminho);
      window.dispatchEvent(new Event('fotoPerfilAtualizada'));

      alert('Foto atualizada com sucesso!');
      navigate('/perfil');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      alert('Erro ao atualizar foto de perfil!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container_configurarPerfil">
      <form className="form_configurarPerfil" onSubmit={handleSubmit}>
        <div className="preview_configurarPerfil">
          {foto ? (
            <img src={foto} alt="Preview" className="img_preview" />
          ) : (
            <div className="placeholder_configurarPerfil">Escolha uma foto</div>
          )}
        </div>

        <input
          className="input_configurarPerfil"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />

        <button
          className="button_configurarPerfil"
          type="submit"
          disabled={loading || !arquivo}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
