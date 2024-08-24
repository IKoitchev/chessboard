import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TokenResponse, UserInfo } from "../../types";
import axios from "axios";
import { decodeJwt, JWTPayload } from "jose";
import { useNavigate } from "react-router-dom";
import apiUrl from "../../utils/apiUrl";

interface UserProviderProps {
  readonly children: ReactNode;
}

interface LoginState {
  isLoggedIn: boolean;
  // role: string;
}

const initialState: LoginState = {
  isLoggedIn: false,
};

interface PasswordLoginParams {
  primaryEmail: string;
  password: string;
}

interface UserContext extends LoginState {
  //   passwordLogin: (params: PasswordLoginParams) => Promise<void>;
  logout: (redirectTo?: string) => any;
  login: ({ primaryEmail, password }: PasswordLoginParams) => any;
  userInfo: UserInfo | null;
  setUserInfo: Dispatch<UserInfo>;
  getAccessToken: () => string;
}
const REFRESH_TOKEN = "refresh_token";
const ACCESS_TOKEN = "access_token";

const Context = createContext<UserContext>(null!);

export function UserProvider({ children }: UserProviderProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [state, setState] = useState(initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])) as JWTPayload;

      if (payload.exp && payload.exp * 1000 < Date.now()) {
        logout();
      }

      setState({ isLoggedIn: true });
    }
    // logout();
  }, []);

  const getAccessToken = useCallback(() => {
    const token = String(localStorage.getItem(ACCESS_TOKEN));
    console.log(token);

    return token;
  }, []);

  const logout = useCallback((redirectTo?: string) => {
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN);
    setState(initialState);
    setUserInfo(null);
    console.log("logout");

    if (redirectTo) {
      navigate(redirectTo);
    }
  }, []);

  const login = useCallback(
    async (
      { primaryEmail, password }: PasswordLoginParams,
      navigateTo?: string
    ) => {
      try {
        const { data } = await axios.post<TokenResponse>(
          `${apiUrl}/auth/email/login`,
          {
            primaryEmail,
            password,
          }
        );

        localStorage.setItem(ACCESS_TOKEN, data.access_token);
        localStorage.setItem(REFRESH_TOKEN, data.refresh_token ?? "");

        const { sub } = decodeJwt(data.access_token);

        setUserInfo({ email: primaryEmail, name: "", sub: sub! });
        setState({ isLoggedIn: true });
        navigate(navigateTo ?? "/play");
      } catch (error: unknown) {
        logout();
        throw error;
      }
    },
    [logout]
  );

  const value = useMemo(
    () => ({
      logout,
      login,
      setUserInfo,
      userInfo,
      getAccessToken,
      ...state,
    }),
    [logout, login, getAccessToken, userInfo, state]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useUser(): UserContext {
  return useContext(Context);
}
