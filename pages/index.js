import
{
  Center, Container, Heading, Kbd, Flex, Grid, VStack, HStack, Text, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  chakra,
  Box,
  Image
} from '@chakra-ui/react'
import { useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import axios from 'axios'

export default function Home()
{

  const [wrong, setWrong] = useState(0)
  const [count, setCount] = useState(0)
  const [isGameFinish, setIsGameFinish] = useState(false)
  const [isLose, setIsLose] = useState(false)
  const [allLetters, setAllLetters] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
  const [selectedLetters, setSelectedLetters] = useState([])

  const containerStyles = {
    width: '100%',
    maxWidth: '600px',
    paddingTop: '36px'
  }

  const verticallyCenter = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data, mutate, error } = useSWRImmutable('https://random-words-api.vercel.app/word', async (url) =>
  {
    const res = await axios.get(url)
    res.data[0].word = res.data[0].word.toLowerCase()
    return res.data
  })

  const showKey = (letter) =>
  {
    if (selectedLetters.includes(letter))
    {
      if (data[0].word.includes(letter))
      {
        return <Kbd
          cursor={'not-allowed'}
          fontSize={'18px'}
          padding={'12px'}
          color={'gray'}
          backgroundColor={'#04ff089c'}
        >{letter}</Kbd>
      }
      else
      {
        return <Kbd
          cursor={'not-allowed'}
          fontSize={'18px'}
          padding={'12px'}
          color={'white'}
          backgroundColor={'#ff04319c'}
        >{letter}</Kbd>
      }
    }
    else
    {
      return <Kbd
        cursor={'pointer'}
        fontSize={'18px'}
        padding={'12px'}
        _hover={{ backgroundColor: '#dde4eb' }}
        _active={{ backgroundColor: '#c2c8ce' }}
        onClick={() => onClickLetter(letter)}
      >{letter}</Kbd>
    }
  }

  const showWord = () =>
  {
    const word = data[0].word.split('')
    return (
      <HStack margin={'16px auto 28px auto'}>
        {word.map(letter =>
        {
          if (selectedLetters.includes(letter))
          {
            return (
              <Text borderBottom={'solid #000 2px'} fontSize={'24px'} width='24px' margin='auto' height={'36px'}>
                <Center>
                  {letter}
                </Center>
              </Text>)
          }
          else
          {
            return (
              <Text borderBottom={'solid #000 2px'} fontSize={'24px'} width='24px' margin='auto' height={'36px'}>
                <Center>

                </Center>
              </Text>)

          }
        })}
      </HStack>)
  }

  const onClickLetter = (letter) =>
  {
    selectedLetters.push(letter)
    if (!data[0].word.includes(letter))
    {
      if (wrong >= 7)
      {
        setIsLose(true)
      }
      setWrong(wrong + 1)
    }
    else
    {
      const word = data[0].word.split('')
      word = [...new Set(word)]
      if (word.every(letter => selectedLetters.includes(letter)))
      {
        setIsGameFinish(true)
      }
    }
    setCount(count + 1)
  }

  if (error)
  {
    return <div>failed to load</div>
  }

  if (!data)
  {
    return (
    <Container height={'100vh'}>
      <Text sx={verticallyCenter} fontSize='28px'>
        loading...
      </Text>
    </Container>)
  }

  else
    return (
      <>
        <Modal isOpen={isGameFinish} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>You win!!!</ModalHeader>
            <ModalBody>
              That word is <chakra.span fontSize='18px' fontWeight='bold'>"{data[0].word}"</chakra.span> and you used {count} letters
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={() =>
              {
                window.location.reload()
              }}>
                Play again
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isLose} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>You Lose!!!</ModalHeader>
            <ModalBody>
              That word is <chakra.span fontSize='18px' fontWeight='bold'>"{data[0].word}"</chakra.span> and you used {count} letters
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={() =>
              {
                window.location.reload()
              }}>
                Play again
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Container sx={containerStyles}>
          <VStack>
            <Box>
              <Heading fontFamily={'Quinquefive'} fontSize={'24px'}>
                Hangman Game
              </Heading>
            </Box>
            <Box>
              <Image src={`/assets/image/${wrong}.png`} marginTop={'32px'}/>
            </Box>
            <Box>
              {showWord()}
            </Box>
            <Box>
              <Text fontSize={'18px'} marginBottom={'32px'} textAlign={'center'}>
                Meaning: {data[0].definition}
              </Text>
            </Box>
            <Box>
              <VStack>
                <HStack>{allLetters.slice(0, 9).map(letter =>
                (
                  showKey(letter)
                ))}
                </HStack>
                <HStack>{allLetters.slice(9, 17).map(letter =>
                (
                  showKey(letter)
                ))}
                </HStack>
                <HStack>{allLetters.slice(17, 26).map(letter =>
                (
                  showKey(letter)
                ))}
                </HStack>
              </VStack>
            </Box>
          </VStack>

        </Container>
      </>
    )
}
