import axios from 'axios'
import getConfig from 'next/config'
import { parseCookies } from 'nookies'
import { notification, message } from 'antd'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const API_URL = serverRuntimeConfig.API_URL || publicRuntimeConfig.API_URL

// For refresh
export const signature_exp = "Signature has expired";

// Need logout
export const not_enough_seg = "Not enough segments";
export const token_rvd = "Token has been revoked";
export const invalid_payload = "Invalid payload padding";
export const signature_failed ="Signature verification failed";
export const csrf_not_match = "CSRF double submit tokens do not match";
export const invalid_alg = "The specified alg value is not allowed";
export const invalid_header_str = "Invalid header string: 'utf-8' codec can't decode byte 0xab in position 22: invalid start byte";
export const missing_cookie_access_token = "Missing cookie access_token_cookie"

// name, email exist
export const errName = ["The name has already been taken."]
export const errEmail = ["The email has already been taken."]

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export const jsonHeaderHandler = () => {
  let headerConfig = {};
  const cookies = parseCookies();
  const { csrf_access_token } = cookies;
  headerConfig = {
    headers: {
      "X-CSRF-TOKEN": csrf_access_token,
    },
  };

  return headerConfig;
}

export const formHeaderHandler = () => {
  let headerConfig = {};
  const cookies = parseCookies();
  const { csrf_access_token } = cookies;
  headerConfig = {
    headers: {
      "X-CSRF-TOKEN": csrf_access_token,
      "content-type": "multipart/form-data",
    },
  };

  return headerConfig;
}

export const refreshHeader = () => {
  let headerConfig = {};
  const cookies = parseCookies();
  const { csrf_refresh_token } = cookies;
  headerConfig = {
    headers: {
      "X-CSRF-TOKEN": csrf_refresh_token,
    },
  };

  return headerConfig;
}

export const resNotification = (type, title, value, placement) => (
  notification[type]({
    closeIcon: <i className="far fa-times" />,
    message: title,
    description: value,
    placement: placement || "bottomRight",
  })
)

export const formErrorMessage = (type = "error", msg) => (
  message[type]({ 
    content: msg, 
    style: { marginTop: '2vh' },
  })
)

export default instance
