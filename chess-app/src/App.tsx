import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PlayPage from "./components/PlayPage";
import LoginPage from "./components/LoginPage";
import { UserProvider } from "./components/UserProvider";
import SideMenu from "./components/SideMenu";
import Logout from "./components/Logout";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <Navbar />
          <SideMenu />
          <Routes>
            <Route path="/logout" element={<Logout />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route
              path="/register"
              element={<LoginPage inLoginMode={false} />}
            ></Route>
            <Route path="/play/:gameId?" element={<PlayPage />}></Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
