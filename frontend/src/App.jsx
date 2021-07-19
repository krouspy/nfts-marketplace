import { Stack } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Content from './components/Content'

function App() {
  return (
    <Stack direction='column' maxW='100vw' minH='100vh'>
      <Navbar />
      <Content />
    </Stack>
  );
}

export default App;
