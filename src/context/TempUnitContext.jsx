import { createContext, useContext, useState } from "react";


const TempUnitContext = createContext()

export const TempContextProvider = ({ children }) => {
    const [unit, setUnit] = useState("C")

    const changeUnit = (newUnit) => {
        setUnit(newUnit)
    }

    return (
        <TempUnitContext.Provider value={{ unit, changeUnit }}>
            {children}
        </TempUnitContext.Provider>
    )
}
export const useTempUnit = () => useContext(TempUnitContext);