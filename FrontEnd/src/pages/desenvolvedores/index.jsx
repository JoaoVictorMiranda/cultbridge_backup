import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DevelopersPage = () => {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const developerUsernames = [
        'JoaoVictorMiranda',
        'LucasVianaAraujo',
        'Lucas-Silva-Manoel',
        'LucasGilReche',
    ];

    const fetchUserData = async (username) => {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error(`Erro ao buscar ${username}`);

            return await response.json();
        } catch {
            return null;
        }
    };

    const fetchAllDevelopers = async () => {
        setLoading(true);
        setError(null);

        try {
            const developersData = await Promise.all(
                developerUsernames.map(username => fetchUserData(username))
            );

            const validDevelopers = developersData.filter(dev => dev !== null);
            setDevelopers(validDevelopers);
        } catch (err) {
            setError('Erro ao carregar dados dos desenvolvedores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllDevelopers();
    }, []);

    // ESTILOS
    const styles = {
        page: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        },
        header: {
            textAlign: 'center',
            marginBottom: '48px'
        },
        title: {
            color: '#333',
            marginBottom: '12px',
            fontSize: '2.5rem',
            fontWeight: '700'
        },
        subtitle: {
            color: '#666',
            fontSize: '1.1rem',
            margin: 0
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            padding: '20px 0'
        },
        card: {
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
        },
        cardHover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)'
        },
        avatar: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            margin: '0 auto 16px',
            border: '4px solid #f0f0f0'
        },
        name: {
            margin: '0 0 8px 0',
            color: '#333',
            fontSize: '1.25rem',
            fontWeight: '600'
        },
        bio: {
            color: '#666',
            margin: '0 0 16px 0',
            lineHeight: '1.4',
            minHeight: '40px'
        },
        stats: {
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            margin: '16px 0',
            fontSize: '0.9rem',
            color: '#555'
        },
        githubButton: {
            display: 'inline-block',
            background: '#24292e',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background 0.2s',
            marginTop: '8px'
        },
        githubButtonHover: { background: '#000' },
        loadingCard: {
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
        },
        skeletonAvatar: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: '#e0e0e0',
            margin: '0 auto 16px'
        },
        skeletonText: {
            height: '16px',
            background: '#e0e0e0',
            borderRadius: '4px',
            margin: '8px auto',
            width: '80%'
        },
        skeletonShort: { width: '60%' },
        error: {
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            color: '#c33',
            marginTop: '20px'
        },
        retryButton: {
            background: '#007acc',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '10px',
            fontSize: '1rem'
        }
    };


    const DeveloperCard = ({ userData }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <div
                style={{
                    ...styles.card,
                    ...(isHovered ? styles.cardHover : {})
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img src={userData.avatar_url} style={styles.avatar} />

                <h3 style={styles.name}>
                    {userData.name || userData.login}
                </h3>

                <p style={styles.bio}>
                    {userData.bio || 'Desenvolvedor'}
                </p>

                <div style={styles.stats}>
                    <span>📂 {userData.public_repos} repos</span>
                    <span>👥 {userData.followers} seguidores</span>
                </div>

                <a
                    href={userData.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        ...styles.githubButton,
                        ...(isHovered ? styles.githubButtonHover : {})
                    }}
                >
                    🌟 Ver no GitHub
                </a>
            </div>
        );
    };


    const LoadingCard = () => (
        <div style={styles.loadingCard}>
            <div style={styles.skeletonAvatar}></div>
            <div style={styles.skeletonText}></div>
            <div style={{ ...styles.skeletonText, ...styles.skeletonShort }}></div>
        </div>
    );


    return (
        <>
            {/* Agora 100% da largura */}
            <Header />

            {/* Conteúdo central */}
            <main style={styles.page}>
                <div style={styles.header}>
                    <h1 style={styles.title}>🎯 Nossa Equipe</h1>
                    <p style={styles.subtitle}>
                        Conheça os desenvolvedores que construíram este projeto
                    </p>
                </div>

                {error && (
                    <div style={styles.error}>
                        <p>{error}</p>
                        <button style={styles.retryButton} onClick={fetchAllDevelopers}>
                            Tentar Novamente
                        </button>
                    </div>
                )}

                <div style={styles.grid}>
                    {loading
                        ? developerUsernames.map((u, i) => <LoadingCard key={i} />)
                        : developers.map(dev => <DeveloperCard key={dev.id} userData={dev} />)
                    }
                </div>
            </main>

            {/* Agora 100% da largura */}
            <Footer />
        </>
    );
};

export default DevelopersPage;
