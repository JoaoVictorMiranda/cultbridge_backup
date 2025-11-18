import React from 'react'

const CommentCard = ({ nome, titulo, data, nota, avaliacao, likes }) => {
  return (
    <div>
      <div className="container_reviews">
        <div className="Card_post">
          <h2>{nome}</h2>
          <h3>{titulo}</h3>
          <p>{data}</p>
          <p>Nota: {nota}</p>
          <p>{avaliacao}</p>
          <p>{likes} Likes</p>
          <button type='button' onClick={() => alert("CURTIDO")}>Curtir</button>
        </div>
      </div>
    </div>
  )
}

export default CommentCard