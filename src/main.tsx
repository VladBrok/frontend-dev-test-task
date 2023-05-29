import "bootstrap/dist/css/bootstrap.css"
import "./index.css"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import ErrorBoundary from "./routes/error-boundary"
import { ROUTE_PATHS } from "./lib/constants"
import Layout from "./routes/layout"
import Auth from "./routes/auth"
import Dashboard from "./routes/dashboard"
import Booking from "./routes/booking"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.AUTH,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: ROUTE_PATHS.AUTH,
        element: <Auth />,
      },
      {
        element: <Layout />,
        children: [
          {
            path: ROUTE_PATHS.DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: ROUTE_PATHS.BOOKING,
            element: <Booking />,
          },
        ],
      },
    ],
  },
])

const queryClient = new QueryClient()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
