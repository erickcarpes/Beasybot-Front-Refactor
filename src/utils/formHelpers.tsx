import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import z from 'zod';

interface RequirementCheck {
  label: string;
  rule: z.ZodString;
}

export const createRequirements = (value: string, checks: RequirementCheck[]) => {
  return (
    <ul className="space-x-xs space-y-xxs flex flex-wrap">
      {checks.map(({ label, rule }) => {
        const isValid = rule.safeParse(value).success;
        const Icon = isValid ? Check : X;

        return (
          <motion.li
            animate={{ color: isValid ? 'var(--color-brand)' : 'var(--color-error)' }}
            className="gap-xxs flex items-center"
            key={label}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              animate={{ scale: isValid ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon size={12} />
            </motion.span>
            <span>{label}</span>
          </motion.li>
        );
      })}
    </ul>
  );
};

export const passwordChecks: RequirementCheck[] = [
  { label: '8 caracteres', rule: z.string().min(8) },
  { label: 'Letra maiúscula', rule: z.string().regex(/[A-Z]/) },
  { label: 'Letra minúscula', rule: z.string().regex(/[a-z]/) },
  { label: 'Caractere especial', rule: z.string().regex(/[!@#$%^&*(),.?"':{}|<>]/) },
  { label: 'Pelo menos um número', rule: z.string().regex(/\d/) },
];
