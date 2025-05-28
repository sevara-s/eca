"use client"

import { request } from "@/request"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  Typography,
  Skeleton,
  Alert,
  AlertTitle,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Paper,
  Stack,
  useTheme,
  useMediaQuery
} from "@mui/material"
import {
  Error as ErrorIcon,
  Inventory as ProductIcon,
  Person as EmployeeIcon,
  LocationOn as AddressIcon,
  AttachFile as FileIcon,
  Numbers as SerialIcon,
  Home as HomeIcon,
  Map as RegionIcon
} from "@mui/icons-material"

interface ProductFile {
  id: number
  contentUrl: string
  originalName: string
  generatedName: string
  mimeType: string
  size: number
  bookingProductId: number
}

interface Address {
  id: number
  region: string
  city: string
  district: string
  street: string
  home: string
  bookingProductId: number
}

interface Order {
  id: number
  productName: string
  productSeriaNumber: string
  employeeId: number
  address?: Address
  productFileList: ProductFile[]
}

export default function OrderList() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { data, isLoading, isError, error } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await request.get("/booking-product/get-all")
      return res.data.content ?? []
    }
  })

  if (isLoading) {
    return (
      <Stack direction="row" flexWrap="wrap" gap={3} justifyContent={isMobile ? 'center' : 'flex-start'}>
        {[...Array(3)].map((_, index) => (
          <Card key={index} sx={{ width: isMobile ? '100%' : 320, flexShrink: 0 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box ml={2} width="100%">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
              <Box mt={2}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    )
  }

  if (isError) {
    return (
      <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
        <AlertTitle>Failed to load orders</AlertTitle>
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <ProductIcon color="primary" sx={{ mr: 1 }} />
        Product Orders
      </Typography>

      {data?.length === 0 ? (
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
           Buyurtmalar topilmadi
          </Typography>
        </Paper>
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={3} justifyContent={isMobile ? 'center' : 'flex-start'}>
          {data?.map((order) => (
            <Card 
              key={order.id} 
              elevation={3} 
              sx={{ 
                width: isMobile ? '100%' : 350,
                flexShrink: 0,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>
                {/* Product Header */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <ProductIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div" noWrap>
                      {order.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <SerialIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {order.productSeriaNumber}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Employee Info */}
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmployeeIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                    Employee ID
                  </Typography>
                  <Chip label={`#${order.employeeId}`} size="small" />
                </Box>

                {/* Address Section */}
                {order.address && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <AddressIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                      Delivery Address
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          <RegionIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          {order.address.region}, {order.address.district}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          <HomeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          {order.address.street}, {order.address.home}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.address.city}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                )}

                {/* Files Section */}
                {order.productFileList?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <FileIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                      Attached Files
                    </Typography>
                    <List dense sx={{ py: 0 }}>
                      {order.productFileList.map((file) => (
                        <ListItem key={file.id} sx={{ px: 0 }}>
                          <ListItemAvatar sx={{ minWidth: 32 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'grey.100' }}>
                              <FileIcon color="action" sx={{ fontSize: 14 }} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={file.originalName}
                            secondary={`${(file.size / 1024).toFixed(1)} KB`}
                            primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  )
}