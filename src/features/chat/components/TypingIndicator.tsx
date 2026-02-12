import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <div className="flex items-center justify-center space-x-1 p-1">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        className="h-2 w-2 rounded-full bg-gray-400"
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        className="h-2 w-2 rounded-full bg-gray-400"
        transition={{ delay: 0.2, duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        className="h-2 w-2 rounded-full bg-gray-400"
        transition={{ delay: 0.4, duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
      />
    </div>
  );
}
