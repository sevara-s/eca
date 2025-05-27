"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Link,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { useRegisterMutation } from '@/request/mutation/mutation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    ism: '',
    familya: '',
    telefon: '+998',
    passport: '',
    karta: '',
    
  });

  const [errors, setErrors,isLoading] = useState({
    ism: false,
    familya: false,
    telefon: false,
    passport: false,
    karta: false,
    password: false
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success'|'error'>('success');

  const { mutate: register} = useRegisterMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefon') {
      if (!value.startsWith('+998')) return;
      if (value.length > 13) return;
    }
    
    if (name === 'karta') {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 16) return;
    }
    
    if (name === 'passport') {
      if (value.length > 9) return;
      if (value.length > 2 && !/^[A-Za-z]{2}\d{0,7}$/.test(value)) return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const newErrors = {
      ism: !formData.ism,
      familya: !formData.familya,
      telefon: !formData.telefon || formData.telefon.length !== 13,
      passport: !formData.passport || formData.passport.length !== 9,
      karta: !formData.karta || formData.karta.length !== 16,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbarMessage('Iltimos, barcha maydonlarni toʻgʻri toʻldiring');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const registrationData = {
      firstName: formData.ism,
      lastName: formData.familya,
      phoneNumber: formData.telefon,
      passportId: formData.passport.toUpperCase(),
      cardNumber: formData.karta,
      genderTypeIndex: 0 // Consider adding a gender field
    };

    register(registrationData);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container maxWidth="sm">
        <Paper elevation={3} className="p-6 rounded-lg">
          <Typography variant="h5" align="center" gutterBottom>
            Roʻyxatdan oʻtish
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Ism"
              name="ism"
              value={formData.ism}
              onChange={handleChange}
              required
              error={errors.ism}
              helperText={errors.ism && "Ismni kiriting"}
            />
            
            <TextField
              fullWidth
              label="Familiya"
              name="familya"
              value={formData.familya}
              onChange={handleChange}
              required
              error={errors.familya}
              helperText={errors.familya && "Familiyani kiriting"}
            />
            
            <TextField
              fullWidth
              label="Telefon raqam"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              required
              error={errors.telefon}
              helperText={errors.telefon ? "+998901234567 formatida" : ""}
            />
            
            <TextField
              fullWidth
              label="Passport seriya"
              name="passport"
              value={formData.passport}
              onChange={handleChange}
              required
              error={errors.passport}
              helperText={errors.passport ? "AA1234567 formatida" : ""}
              inputProps={{
                maxLength: 9,
                style: { textTransform: 'uppercase' }
              }}
            />
            
            <TextField
              fullWidth
              label="Karta raqami"
              name="karta"
              value={formData.karta}
              onChange={handleChange}
              required
              error={errors.karta}
              helperText={errors.karta ? "16 xonali raqam" : ""}
              inputProps={{ maxLength: 16 }}
            />

         
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              className="mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Yuklanmoqda...' : 'Roʻyxatdan oʻtish'}
            </Button>
            
            <Typography align="center" className="mt-4">
              Allaqachon roʻyxatdan oʻtganmisiz?{' '}
              <Link href="/login" underline="hover">
                Tizimga kirish
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}