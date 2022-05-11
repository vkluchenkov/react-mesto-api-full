import { useEffect } from "react";

export function PopupWithForm({ title, name, children, isOpen, onClose, onSubmit, buttonLabel }) {
  const handleEscClose = (e) => e.key === "Escape" && onClose(e);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscClose);
    }
    return () => document.removeEventListener("keydown", handleEscClose);
  }, [isOpen]);

  return (
    <div
      className={isOpen ? `popup popup_form ${name} popup_opened` : `popup popup_form ${name}`}
      onClick={onClose}
    >
      <div className="popup__container">
        <h2 className="popup__title">{title}</h2>
        <form name={name} className="popup__form" noValidate onSubmit={onSubmit}>
          {children}
          <button className="popup__submit-button" type="submit">
            {buttonLabel}
          </button>
        </form>
        <button className="popup__close-button" type="button" onClick={onClose}></button>
      </div>
    </div>
  );
}
