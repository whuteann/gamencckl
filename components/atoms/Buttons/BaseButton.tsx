import React, { ReactNode } from 'react'
import styles from '../../../src/styles/spinner.module.css';

interface ButtonProps {
  className?: string;
  id?: string;
  children: ReactNode;
  iconComponent?: ReactNode;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  clickFunction?: () => void;
  isDisabled?: boolean;
}

const BaseButton = (
    {
        children,
        id = "",
        className,
        iconComponent,
        type,
        isDisabled,
        isLoading = false,
        clickFunction = () => { },
        ...props
    }: ButtonProps) => {
    // Add in onclick function, and also the type of the button
    // Add in loading spinner state too
    return (
        <div className="flex items-center justify-center">
            {
                isLoading ?
                    <button id={id} type={type} className=""><div className={styles.spinner}></div></button>
                    :
                    <button id={id} disabled={isDisabled ? true : false} type={type} onClick={clickFunction} className={`py-1 px-4 ${className} flex flex-row gap-x-2 items-center text-center rounded-3xl text-sm md:text-base lg:text-lg`} {...props}>
                        {
                            iconComponent ? iconComponent : null
                        }
                        {
                            children
                        }

                    </button>
            }
        </div>
    );
};


export default BaseButton
