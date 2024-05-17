import { ButtonHTMLAttributes } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className: string;
}

const Button = ({ className, ...props }: IButtonProps) => {
  const { children, ...buttonProps } = props;
  return (
    <button className={className} {...buttonProps}>
      {children}
    </button>
  );
};

export default Button;
