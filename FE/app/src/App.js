import styles from './App.module.css'
import Landing from './Component/Landing/Landing';
import Mainpage from './Component/Mainpage/Mainpage';
import { Route, Routes } from 'react-router-dom';
import Protectroute from './Component/Protectroute/Protectroute';


function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/mainpage'
          element={
            <Protectroute children={<Mainpage />} />
          } />
      </Routes>
    </div>
  )
}

export default App;