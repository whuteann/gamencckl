import React, { ReactNode } from 'react'
import styles from '../../../src/styles/spinner.module.css';

interface ButtonProps {
    id?: string;
    children: ReactNode;
    iconComponent?: ReactNode;
    isLoading?: boolean;
    type?: "button" | "submit" | "reset";
    clickFunction?: () => void;
    isDisabled?: boolean;
    color?: string;
}

const BaseButton = (
    {
        children,
        id = "",
        iconComponent,
        type,
        isDisabled,
        isLoading = false,
        color = "#E13C30",
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
                    <button
                        id={id}
                        disabled={isDisabled ? true : false}
                        type={type} onClick={clickFunction}
                        style={{
                            backgroundColor: color,
                            fontSize: "24px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            borderRadius: 10,
                            color: "white",
                            width: "100%",
                        }}                    >
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

