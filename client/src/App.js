import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import User from './components/getuser/User.jsx';

function App() {

  const route = createBrowserRouter([
    {
      path:"/",
      element: <User/>
    },
  ])
  return (
    <div className="App">
    <RouterProvider router={route}>

    </RouterProvider>
    </div>
  );
}

export default App;
