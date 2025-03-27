// @ts-nocheck

import  { type ChangeEventHandler, Fragment, useState } from 'react'
import { Dialog, DialogTitle, TextField, CircularProgress } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useModalStore } from '../store/useModalStore'
import { Account} from '../@types'
import { Button } from './ui/button'

interface FormData {
  username: Account['username']
  password: Account['password']
}

const AuthModal = () => {
  const { login, register } = useAuth()
  const { currentModal, setCurrentModal } = useModalStore()

  const isRegisterMode = currentModal === 'REGISTER'
  const isOpen = ['AUTH', 'LOGIN', 'REGISTER'].includes(currentModal)
  const onClose = () => setCurrentModal('')

  const [formData, setFormData] = useState<FormData>({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const clickSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      console.log(formData);

      if (isRegisterMode) {
                await register(formData);
      } else {
        await login(formData);
      }
      onClose()
    } catch (error: unknown) {
      if (typeof error === 'string') {
        setError(error);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(JSON.stringify(error));
      }
    }

    setLoading(false)
  }

  const isSubmitButtonDisabled = !formData['username'] || !formData['password']

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="bg-black"
      sx={{
        "& .MuiDialog-paper": {
          width: "400px", // Fixed width
          maxWidth: "90vw", // Responsive maximum width
          minHeight: "300px",
          padding: "20px",
          backgroundColor: "background.paper",
        },
      }}
    >
      {isRegisterMode ? (
        <DialogTitle>Create a new account</DialogTitle>
      ) : (
        <DialogTitle>Login to your account</DialogTitle>
      )}

      <TextField
        label="Username"
        name="username"
        type="text"
        value={formData["username"]}
        onChange={handleChange}
        variant="filled"
        sx={{ mx: 2, my: 0.5 }}
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData["password"]}
        onChange={handleChange}
        variant="filled"
        sx={{ mx: 2, my: 0.5 }}
        required
      />

      {error && <span className="error">{error}</span>}

      {loading ? (
        <center>
          <CircularProgress color="inherit" />
        </center>
      ) : isRegisterMode ? (
        <Fragment>
          <Button
            variant="default"
            className="w-11/12 mx-auto text-white bg-pink-950 hover:bg-pink-800 mt-8"
            onClick={clickSubmit}
            disabled={isSubmitButtonDisabled}
          >
            Register
          </Button>
          <Button onClick={() => setCurrentModal("LOGIN")}>
            I already have an account
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <Button
            onClick={clickSubmit}
            disabled={isSubmitButtonDisabled}
            variant="default"
            className="w-11/12 mx-auto text-white bg-pink-950 hover:bg-pink-800 mt-8"
          >
            Login
          </Button>
          <Button onClick={() => setCurrentModal("REGISTER")}>
            I don't have an account
          </Button>
        </Fragment>
      )}
    </Dialog>
  );
}

export default AuthModal
