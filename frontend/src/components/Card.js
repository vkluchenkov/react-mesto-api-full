import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function Card({ card, onCardClick, onLikeClick, onDeleteClick }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwner = card.owner._id === currentUser._id;
  const hasMyLike = card.likes.some((like) => like._id === currentUser._id);

  const handleClick = () => onCardClick(card);
  const handleLikeClick = () => onLikeClick(card);
  const handleDeleteClick = () => onDeleteClick(card);

  return (
    <li className="place">
      <img className="place__image" alt={card.name} src={card.link} onClick={handleClick} />
      <div className="place__info">
        <h2 className="place__name">{card.name}</h2>
        <div className="place__like_container">
          <button
            className={hasMyLike ? "place__like place__like_active" : "place__like"}
            type="button"
            onClick={handleLikeClick}
          ></button>
          <p className="place__like_counter">{card.likes.length}</p>
        </div>
        {isOwner ? (
          <button className="place__trash" type="button" onClick={handleDeleteClick}></button>
        ) : (
          <></>
        )}
      </div>
    </li>
  );
}
