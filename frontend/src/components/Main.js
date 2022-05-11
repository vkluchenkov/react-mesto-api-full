import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Card } from "./Card";

export function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = useContext(CurrentUserContext);

  const section = () => {
    if (cards.length) {
      return cards.map((card) => (
        <Card
          card={card}
          onCardClick={onCardClick}
          onLikeClick={onCardLike}
          onDeleteClick={onCardDelete}
          key={`card${card._id}`}
        />
      ));
    }
  };

  return (
    <main className="content">
      <section className="title">
        <div className="title__image-container">
          <img src={currentUser?.avatar} alt="Изображение профиля" className="title__image" />
          <div className="title__image-overlay" onClick={onEditAvatar}></div>
        </div>
        <div className="title__titles">
          <div className="title__name-wrapper">
            <h1 className="title__name">{currentUser?.name}</h1>
            <button type="button" className="title__name-edit" onClick={onEditProfile}></button>
          </div>
          <p className="title__description">{currentUser?.about}</p>
        </div>
        <button className="title__button" type="button" onClick={onAddPlace}></button>
      </section>

      <section className="places">
        <ul className="places__grid">{section()}</ul>
      </section>
    </main>
  );
}
