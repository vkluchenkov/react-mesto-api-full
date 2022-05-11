import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { PopupWithForm } from "./PopupWithForm";

export const EditProfilePopup = ({ isOpen, onClose, onUserUpdate }) => {
  // Hooks
  const currentUser = useContext(CurrentUserContext);

  // States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Effects
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser, isOpen]);

  // Handlers
  const handleChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    }
    if (e.target.name === "about") {
      setDescription(e.target.value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onUserUpdate({
      name,
      about: description,
    });
  };

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать профиль"
      name="edit_profile"
      onSubmit={submitHandler}
      buttonLabel="Сохранить"
    >
      <div className="popup__field-wrapper">
        <input
          type="text"
          className="popup__input"
          id="input-name"
          name="name"
          placeholder="Имя"
          required
          minLength="2"
          maxLength="40"
          onChange={handleChange}
          value={name || ""}
        />
        <p className="popup__error input-name-error"></p>
      </div>
      <div className="popup__field-wrapper">
        <input
          type="text"
          className="popup__input"
          id="input-about"
          name="about"
          placeholder="Профессия"
          required
          minLength="2"
          maxLength="200"
          onChange={handleChange}
          value={description || ""}
        />
        <p className="popup__error input-about-error"></p>
      </div>
    </PopupWithForm>
  );
};
