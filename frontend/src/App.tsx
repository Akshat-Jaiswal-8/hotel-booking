import { ThemeProvider } from "./components/theme-providor.tsx"
import * as React from "react";

function App({children} : {children: React.ReactNode}) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {children}
        </ThemeProvider>
    )
}

export default App
