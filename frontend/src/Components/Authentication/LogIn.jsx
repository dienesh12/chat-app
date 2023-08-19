import React from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const submitHandler = async () => {
    setLoading(true)

    if(!email || !password) {
      toast({
        title: "Please fill all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
      return
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }

      const { data } = await axios.post("https://chatter-qfh1.onrender.com/api/user/login", { email, password }, config)
      
      toast({
        title: "Login Successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })

      localStorage.setItem("userInfo", JSON.stringify(data))

      setLoading(false)
      navigate("/chats")
    } catch(err) {
      toast({
        title: "Error Occurred!",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })

      setLoading(false)
    }
  }

  return (
    <VStack spacing="5px">
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter Your EmailID'
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder='Enter Your Password'
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={()=>setShow(!show)} color="black">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        style={{marginTop: 15}}
        width="100%"
        color="black"
        onClick={submitHandler}
        isLoading={loading}
      >Login</Button>
      
      <Button
        style={{marginTop: 15}}
        width="100%"
        color="red"
        onClick={() => {
          setEmail("guest@example.com")
          setPassword("123456")
        }}
      >Get Guest User Credentials</Button>
    </VStack>
  )
}

export default Login