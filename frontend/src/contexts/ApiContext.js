import React , {createContext,useContext} from "react";
import { postRequest } from "../API";

const ApiContext = createContext();

export const ApiProvider = ({children}) => {
    const api = { postRequest };

    return (
        <ApiContext.Provider value={api}>
          {children}
        </ApiContext.Provider>
      );
};

export const useApi = () => {
    return useContext(ApiContext);
};