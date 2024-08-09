import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { TokenResponse, UserInfo } from "../../types";
import axios from "axios";
import { decodeJwt } from "jose";
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
}
const REFRESH_TOKEN = "refresh_token";
const ACCESS_TOKEN = "access_token";

const Context = createContext<UserContext>(null!);

export function UserProvider({ children }: UserProviderProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [state, setState] = useState(initialState);
  const navigate = useNavigate();

  const logout = useCallback((redirectTo?: string) => {
    localStorage.removeItem(REFRESH_TOKEN);
    setState(initialState);
    setUserInfo(null);

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
      ...state,
    }),
    [logout, login, userInfo, state]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useUser(): UserContext {
  return useContext(Context);
}
