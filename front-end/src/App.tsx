import AppComponent from "./components/AppComponent/AppComponent";
import Header from "./components/Header/Header";
import NavBar from "./components/NavBar/NavBar";
import { ThemeProvider } from "./components/providers/Theme-Provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="min-h-screen max-w-lg py-8 px-4 mx-auto bg-white dark:bg-black flex flex-col justify-between">
        <Header />
        <AppComponent />
        <NavBar />
      </main>
    </ThemeProvider>
  );
}
