const HOME = "HOME", GENOSE = "GENOSE", ANTIGEN = "ANTIGEN", LOGOUT = "LOGOUT", DASHBOARD = "DASHBOARD", DOCTORS = "DOCTORS", 
  GUARDIAN = "GUARDIAN", LOCATION = "LOCATION-SERVICE", PROFILE = "PROFILE"

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
    key: PROFILE,
    icon: 'far fa-user-circle',
    route: '/dashboard/profile',
    label: 'Profile'
  },
  {
    key: LOGOUT,
    icon: 'far fa-sign-out',
    route: '/',
    label: 'Log Out'
  },
]
