import React from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  titleIcon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className,
  titleClassName,
  contentClassName,
  footerClassName,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md",
        className
      )}
    >
      {(title || subtitle) && (
        <div
          className={cn("px-6 py-4 border-b border-gray-200", titleClassName)}
        >
          {title && (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}

      <div className={cn("px-6 py-5", contentClassName)}>{children}</div>

      {footer && (
        <div
          className={cn(
            "px-6 py-3 bg-gray-50 border-t border-gray-200",
            footerClassName
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
