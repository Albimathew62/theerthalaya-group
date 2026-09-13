import { forwardRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const Button = forwardRef(({
  children, variant = 'primary', size = 'md',
  className = '', withArrow = false, ...props
}, ref) => {
  const base = "group inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper";
  const variants = {
    primary: "bg-ink text-white hover:bg-ink/85",
    secondary: "bg-white text-ink border border-line hover:border-ink/40",
    outline: "border border-line text-ink hover:border-ink/40",
    ghost: "text-muted hover:text-ink",
    light: "bg-white text-ink hover:bg-paper-2",
  };
  const sizes = {
    sm: "pl-4 pr-2 py-2 text-sm gap-2",
    md: "pl-6 pr-2.5 py-2.5 text-sm gap-3",
    lg: "pl-7 pr-3 py-3 text-base gap-3",
  };
  const noArrowPad = { sm: "px-4 py-2 text-sm", md: "px-6 py-2.5 text-sm", lg: "px-8 py-3.5 text-base" };
  return (
    <button ref={ref} className={`${base} ${variants[variant]} ${withArrow ? sizes[size] : noArrowPad[size]} ${className}`} {...props}>
      {children}
      {withArrow && (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-ink">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      )}
    </button>
  );
});
Button.displayName = 'Button';
export default Button;
