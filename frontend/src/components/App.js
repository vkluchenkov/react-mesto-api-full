import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import { api } from '../utils/Api';
import { ProtectedRoute } from './ProtectedRoute';
import { Header } from './Header';
import { Main } from './Main';
import { Login } from './Login';
import { Register } from './Register';
import { Footer } from './Footer';

import { ImagePopup } from './ImagePopup';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { InfoPopup } from './InfoPopup';

function App() {
  // Hooks
  const navigate = useNavigate();

  // States
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setErrorPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({ isLoggedIn: false });
  const [cards, setCards] = useState([]);

  // Effects
  useEffect(() => {
    if (currentUser.isLoggedIn) {
      Promise.all([api.getMe(), api.getCards()])
        .then(([user, cards]) => {
          setCurrentUser((prev) => {
            return { ...prev, ...user };
          });
          setCards(cards);
        })
        .catch((error) => console.log(error));
    }
  }, [currentUser.isLoggedIn]);

  //// Returning user auth
  useEffect(() => {
      api
        .getMe()
        .then((res) => {
          setCurrentUser((prev) => {
            return { ...prev, ...res.data, isLoggedIn: true };
          });
        })
        .catch((error) => console.log(error));
  }, []);

  // Handlers
  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleCardClick = (card) => setSelectedCard(card);

  const handleError = () => setErrorPopupOpen(true);
  const handleSuccess = () => setSuccessPopupOpen(true);

  const handleRegistration = (signupPayload) =>
    api.signup(signupPayload).then(handleSuccess).catch(handleError);

  const handleLogin = (loginPayload) =>
    api
      .signin(loginPayload)
      .then((res) => {
        currentUser.isLoggedIn = true;
        currentUser.email = loginPayload.email;
        navigate('/');
      })
      .catch(handleError);

  const handleLogout = async () => {
    try {
      await api.logout()
    }
    catch(err) {
      setCurrentUser({ isLoggedIn: false });
      navigate('/sign-in');
    }
    setCurrentUser({ isLoggedIn: false });
    navigate('/sign-in');
  };

  const handleCardLike = (card) => {
    const hasMyLike = card.likes.some((like) => like._id === currentUser._id);

    api
      .toggleLike(card._id, hasMyLike)
      .then((newCard) => setCards((state) => state.map((c) => (c._id === card._id ? newCard : c))))
      .catch((err) => console.log(err));
  };

  const handleCardDelete = (card) =>
    api
      .deleteCard(card._id)
      .then(() => setCards((state) => state.filter((c) => c._id !== card._id)))
      .catch((err) => console.log(err));

  const closeAllPopups = (e) => {
    if (
      e.type === 'keydown' ||
      e.target.classList.contains('popup_opened') ||
      e.target.classList.contains('popup__close-button')
    ) {
      setIsAddPlacePopupOpen(false);
      setIsEditAvatarPopupOpen(false);
      setIsEditProfilePopupOpen(false);
      setErrorPopupOpen(false);
      setSuccessPopupOpen(false);
      setSelectedCard(null);
    }
  };

  const handleUserUpdate = (user) =>
    api
      .patchMe(user)
      .then((res) => {
        setCurrentUser((state) => {
          return { ...state, ...res };
        });
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleAvatarUpdate = ({ avatar }) =>
    api
      .patchAvatar(avatar)
      .then((user) => {
        setCurrentUser((state) => {
          return { ...state, ...user };
        });
        setIsEditAvatarPopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleAddPlaceSubmit = (cardPayload) =>
    api
      .postCard(cardPayload)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleSuccessPopupClose = (e) => {
    closeAllPopups(e);
    navigate('/sign-in');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header onLogoutClick={handleLogout} />
      <Routes>
        <Route path="/sign-in" element={<Login onSubmit={handleLogin} />} />
        <Route path="/sign-up" element={<Register onSubmit={handleRegistration} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardDelete={handleCardDelete}
                onCardLike={handleCardLike}
              />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUserUpdate={handleUserUpdate}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddCard={handleAddPlaceSubmit}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onAvatarUpdate={handleAvatarUpdate}
      />

      <ImagePopup onClose={closeAllPopups} card={selectedCard} />

      <InfoPopup onClose={handleSuccessPopupClose} isOpen={isSuccessPopupOpen}>
        <div className="popup__info-icon popup__info-icon_success"></div>
        <h2 className="popup__info-title">Вы успешно зарегистрировались!</h2>
      </InfoPopup>

      <InfoPopup onClose={closeAllPopups} isOpen={isErrorPopupOpen}>
        <div className="popup__info-icon popup__info-icon_error"></div>
        <h2 className="popup__info-title">Что-то пошло не так! Попробуйте ещё раз.</h2>
      </InfoPopup>
    </CurrentUserContext.Provider>
  );
}

export default App;

