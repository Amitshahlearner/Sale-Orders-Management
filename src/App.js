import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './components/pages/AuthContext';
import LoginPage from './components/pages/login';
import OrdersPage from './components/pages/order';
import DarkModeSwitch from './components/DarkModeSwitch';
import { Box } from '@chakra-ui/react';

function App() {
  const  { isAuthenticated } = useAuth();
  console.log(isAuthenticated);

  return (
    <>
        <Box p={4} width="100%" maxWidth="500px" position="absolute" top={4} right={4}>
          <DarkModeSwitch />
        </Box>
        <Routes>
          <Route path="*" element={<Navigate to="/login" replace={true} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/orders" element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />} />
        </Routes>
      </>
  );
}

export default App;
