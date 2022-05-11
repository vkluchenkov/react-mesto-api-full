class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
    this._resHandler = (res) => (res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
  }

  // Auth
  signup(singupPayload) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(singupPayload),
    }).then((res) => this._resHandler(res));
  }

  signin(signinPayload) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(signinPayload),
    }).then((res) => this._resHandler(res));
  }

  // Returns array of cards
  getCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => this._resHandler(res));
  }

  //Takes name & link. Returns card
  postCard(card) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(card),
    }).then((res) => this._resHandler(res));
  }

  // Returns OK msg
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._resHandler(res));
  }

  // Returns user
  getMe() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then((res) => this._resHandler(res));
  }

  // Takes name and about. Returns user
  patchMe(me) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(me),
    }).then((res) => this._resHandler(res));
  }

  // Returns user
  patchAvatar(avatarLink) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar: avatarLink }),
    }).then((res) => this._resHandler(res));
  }

  // Returns card
  toggleLike(cardId, hasMyLike) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: `${hasMyLike ? "DELETE" : "PUT"}`,
      headers: this._headers,
    }).then((res) => this._resHandler(res));
  }
}

export const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-35",
  headers: {
    authorization: "1ce0766d-1d99-41e8-b2c1-6a564053af66",
    "Content-Type": "application/json",
  },
});

export const authApi = new Api({
  baseUrl: "https://auth.nomoreparties.co",
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
});
