"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  InputAdornment, 
  IconButton,
  Link,
  Box,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginMutation } from '@/request/mutation/mutation';

type FormData = {
  telefon: string;
  parol: string;
};

type FormErrors = {
  telefon: boolean;
  parol: boolean;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    telefon: '+998',
    parol: ''
  });
  const [errors, setErrors] = useState<FormErrors>({
    telefon: false,
    parol: false
  });
  
  const loginMutation = useLoginMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefon') {
      if (!value.startsWith('+998')) {
        setFormData(prev => ({ ...prev, [name]: '+998' }));
        return;
      }
      if (value.length > 13) return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone: string): boolean => {
    return /^\+998\d{9}$/.test(phone);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      telefon: !validatePhone(formData.telefon),
      parol: formData.parol.trim() === ''
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some(error => error)) {
       
      const username = formData.telefon;  
      loginMutation.mutate({
        username: username,  
        password: formData.parol
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Container maxWidth="sm" className="!py-8">
        <Paper elevation={3} className="p-6 rounded-lg">
          <Typography variant="h4" align="center" gutterBottom className="font-bold">
            Tizimga kirish
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Box className="!flex !flex-col !gap-4">
              <TextField
                fullWidth
                label="Telefon raqam"
                name="telefon"
                value={formData.telefon}
                onChange={handleChange}
                error={errors.telefon || loginMutation.isError}
                helperText={
                  errors.telefon 
                    ? "+998901234567 formatida kiriting" 
                    : loginMutation.isError 
                      ? "Telefon yoki parol noto'g'ri" 
                      : ""
                }
                required
                className="bg-white"
                disabled={loginMutation.isPending}
              />
              
              <TextField
                fullWidth
                label="Parol"
                name="parol"
                type={showPassword ? 'text' : 'password'}
                value={formData.parol}
                onChange={handleChange}
                error={errors.parol || loginMutation.isError}
                helperText={errors.parol && "Parolni kiriting"}
                required
                className="bg-white"
                disabled={loginMutation.isPending}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        className="text-gray-500"
                        disabled={loginMutation.isPending}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                className="py-3 mt-2 bg-blue-600 hover:bg-blue-700"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Kirish'
                )}
              </Button>
              
              <Typography variant="body2" align="center" className="mt-4 text-gray-600">
                Hali ro&apos;yxatdan o&apos;tmaganmisiz?{' '}
                <Link 
                  href="/register" 
                  underline="hover"
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </div> 
  );
}