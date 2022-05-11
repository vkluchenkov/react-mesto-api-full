import { useState } from "react";
import { PopupWithForm } from "./PopupWithForm";

export const AddPlacePopup = ({ isOpen, onClose, onAddCard }) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "placeName") {
      setName(e.target.value);
    }
    if (e.target.name === "placeLink") {
      setLink(e.target.value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onAddCard({
      name,
      link,
    });
    setName("");
    setLink("");
  };

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submitHandler}
      title="Добавить место"
      name="add_place"
      buttonLabel="Сохранить"
    >
      <div className="popup__field-wrapper">
        <input
          type="text"
          className="popup__input"
          id="place-name"
          name="placeName"
          placeholder="Название"
          required
          minLength="2"
          maxLength="30"
          onChange={handleChange}
          value={name}
        />
        <p className="popup__error place-name-error"></p>
      </div>
      <div className="popup__field-wrapper">
        <input
          className="popup__input"
          id="place-link"
          name="placeLink"
          placeholder="Ссылка на картинку"
          type="url"
          required
          onChange={handleChange}
          value={link}
        />
        <p className="popup__error place-link-error"></p>
      </div>
    </PopupWithForm>
  );
};
