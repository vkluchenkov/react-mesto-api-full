import { useState } from "react";

export const AuthForm = ({ onSubmit, title, buttonLabel, hint }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit({
      email,
      password,
    });
    setEmail(null);
    setPassword(null);
  };

  return (
    <main className="content">
      <form className="authform" onSubmit={submitHandler}>
        <h1 className="authform__title">{title}</h1>
        <input
          type="email"
          className="authform__input"
          name="email"
          placeholder="Email"
          required
          minLength="2"
          maxLength="40"
          onChange={handleChange}
          value={email || ""}
        />
        <input
          type="password"
          className="authform__input"
          name="password"
          placeholder="Пароль"
          required
          minLength="6"
          maxLength="40"
          onChange={handleChange}
          value={password || ""}
        />
        <button className="authform__submit-button" type="submit">
          {buttonLabel}
        </button>
        {hint ? hint : <></>}
      </form>
    </main>
  );
};
