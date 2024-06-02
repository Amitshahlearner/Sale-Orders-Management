import { useState } from 'react';
import { Box, Input, Button, Flex } from '@chakra-ui/react';
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login(username, password);
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center" direction="column">
      <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
        <Box textAlign="center" mb={6}>
          Login
        </Box>
        <Box my={4} textAlign="left">
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} mb={4} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} mb={4} />
          <Button width="full" onClick={handleLogin }>Login</Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginPage;
