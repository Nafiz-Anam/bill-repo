import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Billing from "./pages/Billing";

function App() {
    return (
        <>
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="registration" element={<Registration />} />
                        <Route path="login" element={<Login />} />
                        <Route path="/" element={<Billing />} />
                        <Route path="billings" element={<Billing />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    );
}

export default App;
