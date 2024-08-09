import { FC, useState } from "react";
import { useUser } from "../UserProvider";
import axios from "axios";
import { TokenResponse } from "../../types";
import apiUrl from "../../utils/apiUrl";
import InputField from "../InputField";

interface LoginPageProps {
  inLoginMode?: boolean;
}

interface RegisterProps {
  username: string;
  primaryEmail: string;
  password: string;
}

const LoginPage: FC<LoginPageProps> = ({ inLoginMode = true }) => {
  const { login } = useUser();
  const [loginMode, setLoginMode] = useState<boolean>(inLoginMode);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;

    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    console.log(email, password);

    login({ primaryEmail: email, password }).catch((err: unknown) => {
      console.log(err);
    });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;

    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    const confirmPassword = (
      document.getElementById("confirm-password") as HTMLInputElement
    ).value;

    console.log(username, email, password, confirmPassword);

    // TODO: remove catch, add err handling context

    const data: RegisterProps = { primaryEmail: email, username, password };
    axios
      .post<TokenResponse>(`${apiUrl}/auth/email/register`, data)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  function handleSwitch(e: React.FormEvent<HTMLAnchorElement>): void {
    setLoginMode((old) => !old);
  }

  return (
    <>
      <div className="flex justify-center ">
        <form
          className="grid place-content-center border-solid border-2 border-gray-300  w-1/6 h-96"
          onSubmit={loginMode ? handleLogin : handleRegister}
        >
          {loginMode ? null : (
            <>
              <InputField
                type="text"
                id="username"
                label="Username"
                placeholder="Username"
                required="true"
              />
            </>
          )}

          <InputField
            type="text"
            id="email"
            placeholder="email"
            label="Email"
            required="true"
          />

          <InputField
            type="password"
            id="password"
            required="true"
            label="Password"
          />
          {loginMode ? null : (
            <>
              <InputField
                type="password"
                id="confirm-password"
                required="true"
                label="Confirm password"
              />
            </>
          )}
          <input
            className="bg-sky-400 rounded text-white h-7 hover:cursor-pointer border-2 border-blue-100"
            type="submit"
            value={loginMode ? "Log in" : "Register"}
          />
          <div className="">
            <a
              className="underline hover:cursor-pointer"
              onClick={handleSwitch}
            >
              {loginMode ? "Sign up here" : "Log in here"}
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
