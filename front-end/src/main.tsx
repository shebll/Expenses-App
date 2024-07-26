import "./index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider, createRouter } from "@tanstack/react-router";

import Header from "./components/Header/Header";
import { ThemeProvider } from "./components/providers/Theme-Provider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <main className="flex flex-col justify-between max-w-lg min-h-screen px-4 py-8 mx-auto bg-white dark:bg-black">
            <Header />
            <RouterProvider router={router} />
          </main>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
