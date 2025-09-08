import React , {createContext,useContext} from "react";
import config from "../settings/config.js";

const ConfigContext = createContext();

export const ConfigProvider = ({children}) => {
    return (
        <ConfigContext.Provider value={config}>
          {children}
        </ConfigContext.Provider>
      );
}

export const useConfig = () => {
    return useContext(ConfigContext);
};
