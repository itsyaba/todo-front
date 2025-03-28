// @ts-nocheck

import { type ChangeEventHandler, Fragment, useState } from 'react'
import { Dialog } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useModalStore } from '../store/useModalStore'
import { Account } from '../@types'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ClipboardList } from 'lucide-react'

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
      if (isRegisterMode) {
        await register(formData);
      } else {
        await login(formData);
      }
      window.location.reload()
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
      className='bg-black/40 backdrop-blur-sm'
      PaperProps={{
        style: {
          backgroundColor: '#18181B',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '90%',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }
      }}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Logo */}
        <div className="flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-lg">
          <ClipboardList className="w-8 h-8 text-amber-500" />
        </div>
        
        <h1 className="text-2xl font-semibold text-white mb-4">TODO</h1>

        {/* Input Fields */}
        <div className="w-full space-y-3">
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
          />
        </div>

        {error && (
          <span className="text-red-500 text-sm">{error}</span>
        )}

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <Button
            onClick={clickSubmit}
            disabled={isSubmitButtonDisabled || loading}
            variant="default"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
          >
            {loading ? 'Loading...' : isRegisterMode ? 'Register' : 'Login'}
          </Button>

          <Button
            onClick={() => setCurrentModal(isRegisterMode ? "LOGIN" : "REGISTER")}
            variant="ghost"
            className="w-full text-zinc-400 hover:text-white hover:bg-transparent"
          >
            {isRegisterMode ? "or login" : "or register"}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default AuthModal
