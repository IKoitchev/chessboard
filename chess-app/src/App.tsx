import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PlayPage from "./components/PlayPage";
import LoginPage from "./components/LoginPage";
import { UserProvider } from "./components/UserProvider";
import SideMenu from "./components/SideMenu";
import Logout from "./components/Logout";
import { WebSocketProvider } from "./components/WsProvdier";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          {/* <Navbar /> */}
          {/* <SideMenu /> */}
          <SideMenu>
            <WebSocketProvider>
              <Routes>
                <Route path="/logout" element={<Logout />}></Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route
                  path="/register"
                  element={<LoginPage inLoginMode={false} />}
                ></Route>
                <Route path="/play/:gameId?" element={<PlayPage />}></Route>
              </Routes>
            </WebSocketProvider>
          </SideMenu>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
