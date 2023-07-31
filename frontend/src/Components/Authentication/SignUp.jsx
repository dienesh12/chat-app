import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pic, setPic] = useState("")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()


  // Sending the Data to the Backend.
  const submitHandler = async () => {
    setLoading(true)

    if(!name || !email || !password || !confirmPassword) {
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

    if(password !== confirmPassword) {
      toast({
        title: "Password not matching Confirm Password.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }

      console.log(pic);

      const { data } = await axios.post("http://localhost:5005/api/user", {name, email, password, pic}, config)
      
      toast({
        title: "Registration Successful!",
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

  // Uploading Pic to Cloudinary.
  const postPic = (pics) => {
      setLoading(true)
      
      console.log(pics)

      if(pics === undefined) {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        
        return
      }

      console.log(pics)
  
      if(pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData()
        data.append("file", pics)
        data.append("upload_preset", "chat-app")
        data.append("cloud_name", "dohhqfu3i")
        fetch("https://api.cloudinary.com/v1_1/dohhqfu3i/image/upload", {
          method: "post",
          body: data
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString())
          console.log(data.url.toString());
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
      } else {
          console.log("second")
          toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
      }
  }

  return (
    <VStack spacing="5px">
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter Your Name'
          onChange={(e)=> setName(e.target.value)}
        />
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter Your EmailID'
          onChange={(e)=> setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder='Enter Your Password'
            onChange={(e)=> setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={()=>setShow(!show)} color="black">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='con_password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder='Enter Your Password'
            onChange={(e)=> setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={()=>setShow(!show)} color="black">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='pic'>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1}
          accept='image/*'
          onChange={(e)=> postPic(e.target.files[0])}
        />
      </FormControl>
      <Button
        style={{marginTop: 15}}
        width="100%"
        color="black"
        onClick={submitHandler}
        isLoading={loading}
      >Sign Up</Button>
    </VStack>
  )
}

export default SignUp