export const HOME = "HOME", GENOSE = "GENOSE", ANTIGEN = "ANTIGEN", LOGOUT = "LOGOUT", DASHBOARD = "DASHBOARD", DOCTORS = "DOCTORS", 
  GUARDIAN = "GUARDIAN", LOCATION = "LOCATION-SERVICE", ADMIN = "ADMIN"

export const dashboard_routes = [
  {
    key: HOME,
    icon: 'far fa-door-open',
    route: '/',
    label: 'Home'
  },
  {
    key: DASHBOARD,
    icon: 'far fa-house-flood',
    route: '/dashboard',
    label: 'Dashboard'
  },
  {
    key: ANTIGEN,
    icon: 'far fa-sword-laser',
    route: '/dashboard/antigen',
    label: 'Antigen'
  },
  {
    key: GENOSE,
    icon: 'far fa-wind',
    route: '/dashboard/genose',
    label: 'GeNose'
  },
  {
    key: DOCTORS,
    icon: 'far fa-user-md',
    route: '/dashboard/doctors',
    label: 'Doctors'
  },
  {
    key: ADMIN,
    icon: 'far fa-user-secret',
    route: '/dashboard/admin',
    label: 'Admin'
  },
  {
    key: GUARDIAN,
    icon: 'far fa-user-crown',
    route: '/dashboard/guardian',
    label: 'Penjamin'
  },
  {
    key: LOCATION,
    icon: 'far fa-location-circle',
    route: '/dashboard/location-service',
    label: 'Lokasi Pelayanan'
  },
  {
    key: LOGOUT,
    icon: 'far fa-sign-out',
    route: '/',
    label: 'Log Out'
  },
]
