import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Chats from './Pages/Chats';
import Home from './Pages/Home';
import "./App.css"

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/chats" element={<Chats />}/>       
      </Routes>
    </div>
  );
}

export default App;
