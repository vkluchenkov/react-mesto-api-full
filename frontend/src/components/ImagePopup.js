import { useEffect } from "react";

export function ImagePopup({ onClose, card }) {
  const handleEscClose = (e) => e.key === "Escape" && onClose(e);

  useEffect(() => {
    if (card) {
      document.addEventListener("keydown", handleEscClose);
    }
    return () => document.removeEventListener("keydown", handleEscClose);
  }, [card]);

  return (
    <div
      className={card ? `popup popup_image popup_opened` : `popup popup_image`}
      id="image_popup"
      onClick={onClose}
    >
      <figure className="popup__image-container">
        <img className="popup__image" src={card?.link} alt={card?.name} />
        <figcaption className="popup__image-caption">{card?.name}</figcaption>
        <button className="popup__close-button" type="button" onClick={onClose}></button>
      </figure>
    </div>
  );
}
