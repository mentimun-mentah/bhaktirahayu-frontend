import { AnimatePresence, motion } from 'framer-motion'

/**
 * Component for error message when user has invalid value or result
 * @param {object} item - The key of object item of specific error message
 */

const ErrorMessage = ({ item, className }) => (
  <AnimatePresence>
    {!item.isValid && (
      <motion.small
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={"form-text text-left text-danger " + className}
      >
        {item.message}
      </motion.small>
    )}
  </AnimatePresence>
)

export default ErrorMessage
