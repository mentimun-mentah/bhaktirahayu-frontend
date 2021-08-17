export const HOME = "HOME", LOGOUT = "LOGOUT", DASHBOARD = "DASHBOARD", DOCTORS = "DOCTORS", 
  GUARDIAN = "GUARDIAN", LOCATION = "LOCATION-SERVICE", ADMIN = "ADMIN", PROFILE = "PROFILE", INSTITUTION = "INSTITUTION", CLIENTS = "CLIENTS"

export const dashboard_routes = [
  {
    key: HOME,
    icon: 'far fa-door-open',
    route: '/',
    label: 'Home',
    role: ['admin','doctor']
  },
  {
    key: DASHBOARD,
    icon: 'far fa-house-flood',
    route: '/dashboard',
    label: 'Dashboard',
    role: ['admin','doctor']
  },
  {
    key: CLIENTS,
    icon: 'far fa-user-friends',
    route: '/dashboard/clients',
    label: 'Clients',
    role: ['admin','doctor']
  },
  {
    key: DOCTORS,
    icon: 'far fa-user-md',
    route: '/dashboard/doctors',
    label: 'Doctors',
    role: ['admin']
  },
  {
    key: GUARDIAN,
    icon: 'far fa-user-crown',
    route: '/dashboard/guardian',
    label: 'Penjamin',
    role: ['admin']
  },
  {
    key: LOCATION,
    icon: 'far fa-location-circle',
    route: '/dashboard/location-service',
    label: 'Lokasi Pelayanan',
    role: ['admin']
  },
  {
    key: INSTITUTION,
    icon: 'far fa-hospital',
    route: '/dashboard/institution',
    label: 'Instansi',
    role: ['admin']
  },
  {
    key: PROFILE,
    icon: 'far fa-user',
    route: '/dashboard/profile',
    label: 'Profile',
    role: ['admin','doctor']
  },
  {
    key: LOGOUT,
    icon: 'far fa-sign-out',
    route: '/',
    label: 'Log Out',
    role: ['admin','doctor']
  }
]
